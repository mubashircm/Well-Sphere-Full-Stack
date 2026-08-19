import mongoose from "mongoose";

const otpChallengeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    codeHash: {
      type: String,
      required: true,
      select: false,
    },
    fingerprint: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // MongoDB TTL auto-delete
    },
    consumedAt: Date,
    // Brute-force protection: track failed attempts per challenge
    attempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Compound index: only one active (unconsumed, unexpired) challenge per user
otpChallengeSchema.index({ userId: 1, consumedAt: 1, expiresAt: 1 });

export default mongoose.model("OtpChallenge", otpChallengeSchema);
