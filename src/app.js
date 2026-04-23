import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { Habit } from "./models/Habit.js";
import { Completion } from "./models/Completion.js";
import { User } from "./models/User.js";
import { STORE_ITEMS, getAvatarItemSlots, getItemById } from "./config/items.js";
import { calculateLevel, getTodayDateString, getYesterdayDateString } from "./utils/progress.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "..", "public");
const modelDir = path.join(__dirname, "models");

export function createApp({ demoUserEmail }) {
  const app = express();

  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.static(publicDir));
  app.use("/models", express.static(modelDir));

  function normalizeAvatarEquipment(user) {
    if (!user) {
      return user;
    }

    if (!user.equippedAvatarItemIds) {
      user.equippedAvatarItemIds = {};
    }

    if (user.equippedAvatarItemId && !user.equippedAvatarItemIds.get?.("accessory")) {
      if (typeof user.equippedAvatarItemIds.set === "function") {
        user.equippedAvatarItemIds.set("accessory", user.equippedAvatarItemId);
      } else {
        user.equippedAvatarItemIds.accessory = user.equippedAvatarItemId;
      }
    }

    return user;
  }

  function setAvatarSlot(user, slot, itemId) {
    if (typeof user.equippedAvatarItemIds?.set === "function") {
      user.equippedAvatarItemIds.set(slot, itemId);
    } else {
      user.equippedAvatarItemIds = {
        ...(user.equippedAvatarItemIds || {}),
        [slot]: itemId
      };
    }
  }

  async function getDemoUser() {
    const user = normalizeAvatarEquipment(await User.findOne({ email: demoUserEmail }));

    if (!user) {
      throw new Error("Demo user not found. Start the server after database initialization.");
    }

    return user;
  }

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/api/bootstrap", async (_req, res, next) => {
    try {
      const user = await getDemoUser();
      const habits = await Habit.find({ userId: user._id }).sort({ createdAt: -1 });
      const today = getTodayDateString();
      const completions = await Completion.find({
        userId: user._id,
        completedOn: today
      }).select("habitId completedOn");

      const completedHabitIds = completions.map((entry) => entry.habitId.toString());

      res.json({
        user,
        habits,
        completedHabitIds,
        storeItems: STORE_ITEMS
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/habits", async (_req, res, next) => {
    try {
      const user = await getDemoUser();
      const habits = await Habit.find({ userId: user._id }).sort({ createdAt: -1 });
      res.json(habits);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/habits", async (req, res, next) => {
    try {
      const user = await getDemoUser();
      const { title, description = "", frequency = "daily", rewardCoins = 10, rewardXp = 5 } = req.body;

      if (!title?.trim()) {
        return res.status(400).json({ message: "Title is required." });
      }

      const habit = await Habit.create({
        userId: user._id,
        title: title.trim(),
        description: description.trim(),
        frequency,
        rewardCoins,
        rewardXp
      });

      res.status(201).json(habit);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/habits/:habitId", async (req, res, next) => {
    try {
      const user = await getDemoUser();
      const { habitId } = req.params;
      const updates = {};

      for (const field of ["title", "description", "frequency", "rewardCoins", "rewardXp"]) {
        if (field in req.body) {
          updates[field] = typeof req.body[field] === "string" ? req.body[field].trim() : req.body[field];
        }
      }

      const habit = await Habit.findOneAndUpdate(
        { _id: habitId, userId: user._id },
        updates,
        { new: true, runValidators: true }
      );

      if (!habit) {
        return res.status(404).json({ message: "Habit not found." });
      }

      res.json(habit);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/habits/:habitId", async (req, res, next) => {
    try {
      const user = await getDemoUser();
      const { habitId } = req.params;
      const habit = await Habit.findOneAndDelete({ _id: habitId, userId: user._id });

      if (!habit) {
        return res.status(404).json({ message: "Habit not found." });
      }

      await Completion.deleteMany({ habitId: habit._id });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/habits/:habitId/complete", async (req, res, next) => {
    try {
      const user = await getDemoUser();
      const { habitId } = req.params;
      const habit = await Habit.findOne({ _id: habitId, userId: user._id });

      if (!habit) {
        return res.status(404).json({ message: "Habit not found." });
      }

      const today = getTodayDateString();
      const yesterday = getYesterdayDateString();

      const existingCompletion = await Completion.findOne({
        habitId: habit._id,
        userId: user._id,
        completedOn: today
      });

      if (existingCompletion) {
        return res.status(400).json({ message: "Habit already completed today." });
      }

      await Completion.create({
        habitId: habit._id,
        userId: user._id,
        completedOn: today
      });

      habit.streak = habit.lastCompletedOn === yesterday ? habit.streak + 1 : 1;
      habit.lastCompletedOn = today;
      habit.totalCompletions += 1;
      await habit.save();

      user.coins += habit.rewardCoins;
      user.xp += habit.rewardXp;
      user.level = calculateLevel(user.xp);
      await user.save();

      res.json({
        message: "Habit completed.",
        rewards: {
          coins: habit.rewardCoins,
          xp: habit.rewardXp
        },
        habit,
        user
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/store/purchase", async (req, res, next) => {
    try {
      const user = await getDemoUser();
      const { itemId } = req.body;
      const item = getItemById(itemId);

      if (!item) {
        return res.status(404).json({ message: "Item not found." });
      }

      if (user.ownedItemIds.includes(itemId)) {
        return res.status(400).json({ message: "Item already owned." });
      }

      if (user.coins < item.cost) {
        return res.status(400).json({ message: "Not enough coins." });
      }

      user.coins -= item.cost;
      user.ownedItemIds.push(itemId);
      await user.save();

      res.json({ message: "Item purchased.", user });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/store/equip", async (req, res, next) => {
    try {
      const user = await getDemoUser();
      const { itemId } = req.body;
      const item = getItemById(itemId);

      if (!item) {
        return res.status(404).json({ message: "Item not found." });
      }

      if (!user.ownedItemIds.includes(itemId)) {
        return res.status(400).json({ message: "Purchase the item before equipping it." });
      }

      if (item.type === "avatar") {
        setAvatarSlot(user, item.slot || "accessory", itemId);
        if ((item.slot || "accessory") === "accessory") {
          user.equippedAvatarItemId = itemId;
        }
      } else {
        user.equippedBaseItemId = itemId;
      }

      await user.save();
      res.json({ message: "Item equipped.", user });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/store/unequip", async (req, res, next) => { 
      try { 
        const user = await getDemoUser(); 
        const { itemType, slot } = req.body; 
 
        if (itemType === "avatar") {
          const targetSlot = slot || "accessory";

          if (!getAvatarItemSlots().includes(targetSlot)) {
            return res.status(400).json({ message: "A valid avatar slot is required." });
          }

          setAvatarSlot(user, targetSlot, null);

          if (targetSlot === "accessory") {
            user.equippedAvatarItemId = null;
          }
        } else if (itemType === "base") {
          user.equippedBaseItemId = null;
        } else {
          return res.status(400).json({ message: "A valid item type is required." }); 
        } 
 
        await user.save(); 
        res.json({ message: "Item unequipped.", user }); 
      } catch (error) { 
        next(error); 
      } 
    }); 
 
  app.post("/api/profile/reset", async (_req, res, next) => {
    try {
      const user = await getDemoUser();
      await Habit.deleteMany({ userId: user._id });
      await Completion.deleteMany({ userId: user._id });

      user.coins = 0;
      user.xp = 0;
      user.level = 1;
      user.ownedItemIds = [];
      user.equippedAvatarItemIds = {};
      user.equippedAvatarItemId = null;
      user.equippedBaseItemId = null;
      await user.save();

      res.json({
        message: "Progress reset.",
        user,
        habits: [],
        completedHabitIds: []
      });
    } catch (error) {
      next(error);
    }
  });

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong.",
      detail: err.message
    });
  });

  app.get("*", (_req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });

  return app;
}

