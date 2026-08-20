import mongoose from "mongoose";

const articleSectionSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
    trim: true,
  },
}, { _id: false });

const articleSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    accent: {
      type: String,
      enum: ["sleep", "movement", "hydration", "headache"],
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    readingTime: {
      type: Number,
      required: true,
      min: 1,
    },
    featuredImage: {
      url: { type: String, trim: true },
      secureUrl: { type: String, trim: true },
      publicId: { type: String, trim: true },
      alt: { type: String, trim: true, default: "" },
      caption: { type: String, trim: true, default: "" },
    },
    sections: [articleSectionSchema],
    homeCare: {
      type: String,
      trim: true,
    },
    lifestyle: {
      type: String,
      trim: true,
    },
    exercise: {
      type: String,
      trim: true,
    },
    seekCare: {
      type: String,
      trim: true,
    },
    sources: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "pending-review", "published", "changes-requested"],
      default: "draft",
      index: true,
    },
    reviewNotes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Performance Indexes
articleSchema.index({ status: 1, topic: 1, createdAt: -1 });
articleSchema.index({ author: 1, status: 1, updatedAt: -1 });
articleSchema.index({ slug: 1, status: 1 });
articleSchema.index({
  title: "text",
  excerpt: "text",
  homeCare: "text",
  lifestyle: "text",
});

export default mongoose.model("Article", articleSchema);
