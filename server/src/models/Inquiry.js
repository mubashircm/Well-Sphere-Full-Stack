import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address."],
    },
    subject: {
      type: String,
      required: [true, "Subject category is required."],
      enum: [
        "Editorial Feedback",
        "Article Suggestion",
        "General Inquiry",
        "Bug Report",
        "Partnership",
      ],
    },
    message: {
      type: String,
      required: [true, "Message content is required."],
      trim: true,
      maxlength: 5000,
    },
    status: {
      type: String,
      enum: ["unread", "in-review", "resolved"],
      default: "unread",
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

inquirySchema.index({ createdAt: -1 });
inquirySchema.index({ subject: 1, status: 1 });

const Inquiry = mongoose.model("Inquiry", inquirySchema);

export default Inquiry;
