import mongoose from "mongoose";

const commentReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reason: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  reportedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["approved", "flagged", "rejected"],
      default: "approved",
      index: true,
    },
    reports: [commentReportSchema],
  },
  {
    timestamps: true,
  }
);

// Performance Indexes
commentSchema.index({ article: 1, status: 1, createdAt: -1 });
commentSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Comment", commentSchema);
