import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import mongoose from "mongoose";
import env from "./config/env.js";
import connectDatabase from "./config/database.js";
import errorHandler from "./middlewares/errorHandler.js";
import sanitize from "./middlewares/sanitize.js";
import { generalLimiter } from "./middlewares/rateLimiters.js";
import authRoutes from "./routes/authRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import editorRoutes from "./routes/editorRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import { verifySmtpConnection } from "./services/mailer.js";

const app = express();
app.set("trust proxy", 1);

// Security Headers & Payload Compression
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    // Enable CSP in report-only mode: protects without breaking SPA CDN assets
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"], // Vite inlines scripts in dev
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: env.nodeEnv === "production" ? [] : null,
      },
    },
  })
);
app.use(compression());

// CORS: dynamic allowlist supporting localhost, configured CLIENT_URL/FRONTEND_URL, and Vercel deployments
const ALLOWED_ORIGINS = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // 1. Allow requests with no origin (server-to-server, mobile clients, Postman, health checks)
      if (!origin) {
        return cb(null, true);
      }

      // 2. Exact match in allowlist (localhost, process.env.CLIENT_URL, process.env.FRONTEND_URL)
      if (ALLOWED_ORIGINS.includes(origin)) {
        return cb(null, true);
      }

      // 3. Match localhost (any port) or any Vercel deployment preview/production subdomain
      if (
        /^http:\/\/localhost(:\d+)?$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return cb(null, true);
      }

      // Safe rejection without throwing unhandled error (prevents 500 crashes)
      cb(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);
app.use(express.json({ limit: "32kb" }));
app.use(cookieParser());
app.use(sanitize);
app.use("/api/", generalLimiter);

// Health check probe
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "WellSphere API is running.",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
});

// Mounted Versioned Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", contentRoutes);
app.use("/api/v1", profileRoutes);
app.use("/api/v1/editor", editorRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/contact", contactRoutes);

// Central Error Handler
app.use(errorHandler);

let server;

connectDatabase()
  .then(async () => {
    await verifySmtpConnection();
    server = app.listen(env.port, () => {
      console.log(`WellSphere API running on port ${env.port} in ${env.nodeEnv} mode`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed.");
    if (env.nodeEnv !== "production") console.error(error.message);
    process.exit(1);
  });

// Graceful Shutdown Handlers
function shutdownGracefully(signal) {
  console.log(`Received ${signal}. Shutting down HTTP server and database gracefully.`);
  if (server) {
    server.close(async () => {
      console.log("HTTP server closed.");
      await mongoose.connection.close(false);
      console.log("MongoDB connection closed.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

process.on("SIGTERM", () => shutdownGracefully("SIGTERM"));
process.on("SIGINT", () => shutdownGracefully("SIGINT"));


export default app;