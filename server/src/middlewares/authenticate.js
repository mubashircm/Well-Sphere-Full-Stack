import jwt from "jsonwebtoken";
import env from "../config/env.js";
import AppError from "../utils/AppError.js";
export default (req, res, next) => { try { const token = req.cookies.access_token; if (!token) throw new Error(); const payload = jwt.verify(token, env.jwtAccessSecret); if (payload.type !== "access") throw new Error(); req.auth = payload; next(); } catch { next(new AppError(401, "AUTHENTICATION_REQUIRED", "Please sign in to continue.")); } };
