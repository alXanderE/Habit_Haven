import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    displayName: {
      type: String,
      required: true,
      trim: true
    },
    coins: {
      type: Number,
      default: 0
    },
    xp: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    ownedItemIds: {
      type: [String],
      default: []
    },
    equippedAvatarItemIds: {
      type: Map,
      of: String,
      default: {}
    },
    equippedAvatarItemId: {
      type: String,
      default: null
    },
    equippedBaseItemId: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
