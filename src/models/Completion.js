import mongoose from "mongoose";

const completionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
      index: true
    },
    completedOn: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

completionSchema.index({ habitId: 1, completedOn: 1 }, { unique: true });

export const Completion = mongoose.model("Completion", completionSchema);
