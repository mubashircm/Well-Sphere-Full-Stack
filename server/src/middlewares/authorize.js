import AppError from "../utils/AppError.js";

/**
 * Middleware to restrict route access to specific roles.
 * Must be placed after the `authenticate` middleware.
 * @param  {...string} roles - Allowed roles (e.g. "editor", "superadmin")
 */
export default (...roles) => {
  return (req, res, next) => {
    if (!req.auth) {
      return next(new AppError(401, "AUTHENTICATION_REQUIRED", "Please sign in to access this resource."));
    }
    if (!roles.includes(req.auth.role)) {
      return next(new AppError(403, "ACCESS_DENIED", "You do not have permission to perform this action."));
    }
    next();
  };
};
