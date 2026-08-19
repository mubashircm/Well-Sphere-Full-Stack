import mongoose from "mongoose";
const sessionSchema = new mongoose.Schema({ userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }, refreshTokenHash: { type: String, required: true, select: false }, expiresAt: { type: Date, required: true, index: { expires: 0 } }, revokedAt: Date, userAgent: String, ip: String }, { timestamps: true });
sessionSchema.index({ userId: 1, expiresAt: 1 });
export default mongoose.model("Session", sessionSchema);
