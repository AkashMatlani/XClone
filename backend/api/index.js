import app from "../src/server.js";
import { connectDB } from "../src/config/db.js";

let dbPromise = null;

export default async (req, res) => {
  try {
    if (!dbPromise) dbPromise = connectDB(); // cache Mongo connection
    await dbPromise;

    app(req, res);
  } catch (error) {
    console.error("Serverless function error:", error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};
