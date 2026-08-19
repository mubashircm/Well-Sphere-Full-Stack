import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["article_published", "comment_reply", "system"],
      required: true,
    },
    message: { type: String, required: true, trim: true, maxlength: 300 },
    link: { type: String, trim: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true, _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "editor", "superadmin"], default: "user" },
    resetTokenHash: { type: String, select: false },
    resetTokenExpiresAt: Date,
    otp: { type: String, select: false },
    otpExpires: Date,
    tempToken: { type: String, select: false },
    trustedDevices: {
      type: [
        {
          deviceId: { type: String, required: true },
          userAgent: { type: String },
          ip: { type: String },
          verifiedAt: { type: Date, default: Date.now },
          lastUsedAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    // M5 — User Dashboard
    savedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
    followedTopics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
    notifications: [notificationSchema],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
