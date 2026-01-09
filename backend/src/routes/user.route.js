import express from "express";
import {
  getUserProfile,
  syncUser,
  getCurrentUser,
  followUser,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { updateProfile } from "../controllers/user.controller.js";

const router = express.Router();

//public route
router.get("/profile/:userName", getUserProfile);

//protected route

//follow User
router.post("/follow/targetUserId", protectRoute, followUser);

//Current User Data
router.post("/me", protectRoute, getCurrentUser);

//saving data to DB
router.post("/sync", protectRoute, syncUser);

//update profile
//check protectRoute for Authenticated and next function called for updateProfile
router.put("/profile", protectRoute, updateProfile);

export default router;
