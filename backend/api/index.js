import serverless from "serverless-http";
import app from "../src/server.js";
import { connectDB } from "../src/config/db.js";

let dbPromise = null;

// Wrap Express app
const handler = serverless(app);

export default async (req, res) => {
  try {
    if (!dbPromise) dbPromise = connectDB(); // cache Mongo connection
    await dbPromise;

    return handler(req, res); // use serverless-http wrapper
  } catch (error) {
    console.error("Serverless function error:", error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};
