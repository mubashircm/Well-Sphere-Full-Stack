import AppError from "../utils/AppError.js";

export default (error, req, res, next) => {
  // Known custom AppError
  if (error instanceof AppError) {
    return res.status(error.status).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    });
  }

  // Mongoose Validation Error
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: messages.join(" ") || "Invalid data submitted.",
      },
    });
  }

  // Mongoose Duplicate Key Error (code 11000)
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0] || "resource";
    return res.status(409).json({
      success: false,
      error: {
        code: "DUPLICATE_KEY",
        message: `A record with that ${field} already exists.`,
      },
    });
  }

  // Mongoose Invalid ObjectId (CastError)
  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      error: {
        code: "INVALID_IDENTIFIER",
        message: `Resource identifier '${error.value}' is not formatted correctly.`,
      },
    });
  }

  // JWT Verification Error
  if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: {
        code: "AUTHENTICATION_REQUIRED",
        message: "Your session has expired or is invalid. Please sign in again.",
      },
    });
  }

  // Fallback Internal Server Error
  console.error("Unhandled Error:", error);
  const isProduction = process.env.NODE_ENV === "production";
  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: isProduction
        ? "An unexpected internal server error occurred."
        : error.message || "Internal server error",
    },
  });
};
