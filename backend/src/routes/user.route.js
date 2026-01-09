import express from "express";
import { getUserProfile, syncUser } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { updateProfile } from "../controllers/user.controller.js";

const router = express.Router();
router.get("/profile/:userName", getUserProfile);

//saving data to DB
router.post("/sync", protectRoute, syncUser);

//update profile
//check protectRoute for Authenticated and next function called for updateProfile
router.put("/profile", protectRoute, updateProfile);

export default router;
