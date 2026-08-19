import { v2 as cloudinary } from "cloudinary";
import env from "../config/env.js";
import AppError from "../utils/AppError.js";

// Initialize Cloudinary SDK
if (env.cloudinary.isConfigured) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true,
  });
}

/**
 * Upload an image (base64 string or remote URL) to Cloudinary.
 * @param {string} fileInput - Base64 data URI or remote image URL.
 * @param {object} [options] - Additional Cloudinary upload options.
 * @returns {Promise<{ url: string, secureUrl: string, publicId: string, width: number, height: number, format: string }>}
 */
export async function uploadImage(fileInput, options = {}) {
  if (!fileInput) {
    throw new AppError(400, "MISSING_FILE", "No image data provided for upload.");
  }

  if (!env.cloudinary.isConfigured) {
    // In local dev without Cloudinary keys, accept data URI directly with fallback metadata
    if (env.nodeEnv !== "production") {
      console.warn("Cloudinary is not configured in .env. Using raw data URI as local fallback.");
      return {
        url: fileInput,
        secureUrl: fileInput,
        publicId: `local_${Date.now()}`,
        width: 1200,
        height: 800,
        format: "webp",
      };
    }
    throw new AppError(500, "CLOUDINARY_NOT_CONFIGURED", "Media storage service is not configured.");
  }

  try {
    const uploadResult = await cloudinary.uploader.upload(fileInput, {
      folder: "health-platform/articles",
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "avif", "svg"],
      transformation: [
        { quality: "auto", fetch_format: "auto" },
      ],
      ...options,
    });

    return {
      url: uploadResult.url,
      secureUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
    };
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new AppError(502, "MEDIA_UPLOAD_FAILED", error.message || "Failed to upload image to media storage.");
  }
}

/**
 * Delete an image from Cloudinary by its publicId.
 * @param {string} publicId - The Cloudinary public_id of the asset.
 */
export async function deleteImage(publicId) {
  if (!publicId || publicId.startsWith("local_")) return;

  if (!env.cloudinary.isConfigured) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Failed to delete Cloudinary asset ${publicId}:`, error.message);
  }
}
