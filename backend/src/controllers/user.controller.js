import asyncHanler from "express-async-handler";
import User from "../models/user.model.js";
import { clerkClient, getAuth } from "@clerk/express";
import Notification from "../models/notification.model.js";

export const getUserProfile = asyncHanler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ user });
});

export const updateProfile = asyncHanler(async (req, res) => {
  const { userId } = getAuth(req);
  const user = await User.findOneAndUpdate({ clerkId: userId }, req.body, {
    new: true,
  });

  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ user });
});

export const syncUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);

  // Check if user already exists
  let existingUser = await User.findOne({ clerkId: userId });
  if (existingUser) {
    return res.status(200).json({ user: existingUser, message: "User already exists" });
  }

  // Create new User from Clerk
  const clerkUser = await clerkClient.users.getUser(userId);

  // Generate a unique username
  let baseUsername = clerkUser.emailAddresses[0].emailAddress.split("@")[0];
  let username = baseUsername;
  let counter = 1;
  while (await User.findOne({ username })) {
    username = `${baseUsername}${counter}`;
    counter++;
  }

  console.log("Creating user with username:", username);
  const userData = {
    clerkId: userId,
    email: clerkUser.emailAddresses[0].emailAddress,
    firstName: clerkUser.firstName || "",
    lastName: clerkUser.lastName || "",
    username,
    profilePicture: clerkUser.imageUrl || "",
  };

  try {
    const user = await User.create(userData);
    res.status(201).json({ user, message: "User created successfully" });
  } catch (error) {
    console.error("User creation failed:", error);
    res.status(500).json({ error: "Failed to create user. Possibly duplicate email/username." });
  }
});



export const getCurrentUser = asyncHanler(async (req, res) => {
  const { userId } = getAuth(req);
  const user = await User.findOne({ clerkId: userId });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.status(200).json({ user });
});

export const followUser = asyncHanler(async (req, res) => {
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

  res
    .status(200)
    .json({
      message: isFollowing
        ? "User unfollowed successfully"
        : "User followed successfully",
    });
});
