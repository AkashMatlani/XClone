import mongoose from "mongoose";
import { ENV } from "./env.js";

// Global cached connection for serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) {
    return cached.conn; // return existing connection
  }

  if (!cached.promise) {
    // Create a new connection promise
    cached.promise = mongoose.connect(ENV.MONGO_URI).then((mongoose) => {
      console.log("Connected to MongoDB (serverless-safe)");
      return mongoose;
    }).catch((err) => {
      console.error("MongoDB connection error:", err);
      throw err; // crash if DB cannot connect
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
