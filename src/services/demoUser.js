import { User } from "../models/User.js";

export async function ensureDemoUser() {
  const email = process.env.DEMO_USER_EMAIL || "demo@habithaven.app";
  const displayName = process.env.DEMO_USER_NAME || "Demo User";

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      email,
      displayName,
      coins: 50,
      xp: 0,
      level: 1,
      ownedItemIds: []
    });
  }

  return user;
}
