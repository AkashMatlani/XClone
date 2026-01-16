import express from "express";
import { connectDB } from "./config/db.js";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import { arcjetMiddleware } from "./middleware/arcjet.middleware.js";

import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import notificationRoutes from "./routes/notification.route.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.use(arcjetMiddleware);

// Connect to DB before handling requests
await connectDB(); // singleton ensures safe serverless behavior

// Routes
app.get("/", (req, res) => res.send("Hello from server 🚀"));
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

export default app;
