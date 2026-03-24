import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
      default: ""
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly"],
      default: "daily"
    },
    rewardCoins: {
      type: Number,
      min: 1,
      max: 100,
      default: 10
    },
    rewardXp: {
      type: Number,
      min: 1,
      max: 100,
      default: 5
    },
    streak: {
      type: Number,
      default: 0
    },
    totalCompletions: {
      type: Number,
      default: 0
    },
    lastCompletedOn: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

export const Habit = mongoose.model("Habit", habitSchema);
