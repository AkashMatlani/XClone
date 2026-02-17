import mongoose from "mongoose";
import { ENV } from "./env.js";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return; // Already connected
  try {
    await mongoose.connect(ENV.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err; // Crash if DB cannot connect
  }
};
