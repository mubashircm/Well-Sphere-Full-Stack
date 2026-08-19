import mongoose from "mongoose";
import env from "./env.js";

export default function connectDatabase() {
  return mongoose.connect(env.mongoUri, {
    maxPoolSize: 25,
    minPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    autoIndex: env.nodeEnv !== "production", // in prod, indexes are built asynchronously
  });
}
