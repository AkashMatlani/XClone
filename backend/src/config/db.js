import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connctDB = async () => {
  try {

    await mongoose.connect(ENV.MONGO_URI);
    console.log("Connected db successfully")
  } catch (error) {
    console.log("Error Connecting DB")
    process.exit(1);
  }
};
