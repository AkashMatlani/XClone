import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { clerkClient, verifyToken } from "@clerk/clerk-sdk-node";

// Helper to extract userId from Bearer JWT
const getUserIdFromHeader = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(403).json({ error: "No token provided" });
    return null;
  }
  try {
    const token = authHeader.replace("Bearer ", "");
    const payload = await verifyToken(token);
    return payload.sub;
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(403).json({ error: "Invalid or expired token" });
    return null;
  }
};

// GET /api/users/:userName
export const getUserProfile = asyncHandler(async (req, res) => {
  const { userName } = req.params;
  const user = await User.findOne({ userName });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.status(200).json({ user });
});

// PUT /api/users/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const userId = await getUserIdFromHeader(req, res);
  if (!userId) return;

  const user = await User.findOneAndUpdate({ clerkId: userId }, req.body, {
    new: true,
  });

  if (!user) return res.status(404).json({ error: "User not found" });
  res.status(200).json({ user });
});

// POST /api/users/sync
export const syncUser = asyncHandler(async (req, res) => {
  const userId = await getUserIdFromHeader(req, res);
  if (!userId) return;

  // Fetch user from Clerk
  const clerkUser = await clerkClient.users.getUser(userId);

  const userData = {
    clerkId: userId,
    email: clerkUser.emailAddresses[0].emailAddress,
    firstName: clerkUser.firstName || "",
    lastName: clerkUser.lastName || "",
    userName:
      clerkUser.emailAddresses[0].emailAddress.split("@")[0] || userId,
    profilePicture: clerkUser.imageUrl || "",
  };

  // Upsert: create if not exists, update if exists
  const user = await User.findOneAndUpdate(
    { clerkId: userId },
    userData,
    { new: true, upsert: true }
  );

  res.status(200).json({ user, message: "User synced successfully" });
});

// GET /api/users/me
export const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = await getUserIdFromHeader(req, res);
  if (!userId) return;

  const user = await User.findOne({ clerkId: userId });
  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ user });
});

// POST /api/users/follow/:targetedUserId
export const followUser = asyncHandler(async (req, res) => {
  const userId = await getUserIdFromHeader(req, res);
  if (!userId) return;

  const { targetedUserId } = req.params;

  if (userId === targetedUserId)
    return res.status(400).json({ error: "You cannot follow yourself" });

  const currentUser = await User.findOne({ clerkId: userId });
  const targetUser = await User.findById(targetedUserId);

  if (!currentUser || !targetUser)
    return res.status(404).json({ error: "User not found" });

  const isFollowing = currentUser.following.includes(targetedUserId);

  if (isFollowing) {
    // unfollow
    await User.findByIdAndUpdate(currentUser._id, {
      $pull: { following: targetedUserId },
    });
    await User.findByIdAndUpdate(targetedUserId, {
      $pull: { followers: currentUser._id },
    });
  } else {
    // follow
    await User.findByIdAndUpdate(currentUser._id, {
      $push: { following: targetedUserId },
    });
    await User.findByIdAndUpdate(targetedUserId, {
      $push: { followers: currentUser._id },
    });

    // Create notification
    await Notification.create({
      from: currentUser._id,
      to: targetedUserId,
      type: "follow",
    });
  }

  res.status(200).json({
    message: isFollowing
      ? "User unfollowed successfully"
      : "User followed successfully",
  });
});
