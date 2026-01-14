import express from "express";
import { connctDB } from "./config/db.js";
import { ENV } from "./config/env.js";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";

const app = express();

//cors
app.use(cors());

//for handle req.body
app.use(express.json());

//Handle Authentication
app.use(clerkMiddleware());

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

//error handling middleware
app.use((err, req, res,next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

const startServer = async () => {
  try {
    await connctDB();
    app.listen(ENV.PORT, () =>
      console.log("Server is up and running on PORT:", ENV.PORT)
    );
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
