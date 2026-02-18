import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import { clerkClient, getAuth } from "@clerk/express";
import Notification from "../models/notification.model.js";

export const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const user = await User.findOneAndUpdate({ clerkId: userId }, req.body, {
    new: true,
  });

  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ user });
});

export const syncUser = asyncHandler(async (req, res) => {
  console.log("---- SYNC USER CALLED ----");

  const auth = getAuth(req);
  const { userId } = auth;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  console.log("Fetching user from Clerk...");
  const clerkUser = await clerkClient.users.getUser(userId);

  const email = clerkUser.emailAddresses?.[0]?.emailAddress;
  if (!email) {
    return res.status(400).json({ error: "Cannot create user: no email found" });
  }

  // Base username
  let baseUsername = clerkUser.firstName
    ? clerkUser.firstName.toLowerCase()
    : email.split("@")[0].toLowerCase();

  let attempts = 0;
  const maxAttempts = 5;
  let finalUsername;

  while (attempts < maxAttempts) {
    const username =
      attempts === 0
        ? baseUsername
        : `${baseUsername}${Math.floor(Math.random() * 1000)}`;

    try {
      const user = await User.findOneAndUpdate(
        { clerkId: userId }, // PRIMARY identity
        {
          $setOnInsert: {
            clerkId: userId,
            email,
            firstName: clerkUser.firstName || "",
            lastName: clerkUser.lastName || "",
            username,
            profilePicture: clerkUser.imageUrl || "",
          },
        },
        {
          new: true,
          upsert: true,
        }
      );

      finalUsername = username;
      return res.status(200).json({
        user,
        message: "User synced successfully",
      });
    } catch (err) {
      if (err.code === 11000 && err.keyPattern?.username) {
        attempts++;
      } else if (err.code === 11000 && err.keyPattern?.email) {
        // Email already exists → fetch that user
        const existingEmailUser = await User.findOne({ email });
        return res.status(200).json({
          user: existingEmailUser,
          message: "User already exists with this email",
        });
      } else {
        throw err;
      }
    }
  }

  return res.status(500).json({
    error: "Failed to generate unique username after multiple attempts",
  });
});



export const getCurrentUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const user = await User.findOne({ clerkId: userId });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.status(200).json({ user });
});

export const followUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { targetedUserId } = req.params;

  if (userId == targetedUserId)
    return res.status(400).json({ error: "You can not follow yourself" });

  const currentUser = await User.findOne({ clerkId: userId });
  const targetUser = await User.findById(targetedUserId);

  if (!currentUser || !targetUser)
    res.status(404).json({ error: "User not found" });

  const isFollowing = currentUser.following.includes(targetedUserId);

  if (isFollowing) {
    //unfollow
    await User.findByIdAndUpdate(currentUser._id, {
      $pull: { following: targetedUserId },
    });

    await User.findByIdAndUpdate(targetedUserId, {
      $pull: { followers: currentUser._id },
    });
  } else {
    //follow
    await User.findByIdAndUpdate(currentUser._id, {
      $push: { following: targetedUserId },
    });

    await User.findByIdAndUpdate(targetedUserId, {
      $push: { followers: currentUser._id },
    });

    //Create Notification
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
