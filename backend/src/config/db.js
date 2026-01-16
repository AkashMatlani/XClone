import mongoose from "mongoose";
import { ENV } from "./env.js";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }
  try {
    await mongoose.connect(ENV.MONGO_URI);
    isConnected = true;
    console.log("Connected to DB successfully");
  } catch (err) {
    console.error("DB connection error:", err);
    throw err; // crash will happen if DB is unreachable
  }
};
