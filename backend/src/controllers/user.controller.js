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

import asyncHandler from "express-async-handler";
import { getAuth } from "@clerk/clerk-sdk-node";
import { clerkClient } from "../clerkClient"; // adjust import
import User from "../models/User";

export const syncUser = asyncHandler(async (req, res) => {
  console.log("---- SYNC USER CALLED ----");

  const auth = getAuth(req);
  console.log("Auth object:", auth);

  const { userId } = auth;
  if (!userId) {
    console.log("No userId found");
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Check if user already exists in MongoDB
  const existingUser = await User.findOne({ clerkId: userId });
  if (existingUser) {
    return res
      .status(200)
      .json({ user: existingUser, message: "User already exists" });
  }

  console.log("Fetching user from Clerk...");
  const clerkUser = await clerkClient.users.getUser(userId);
  console.log("Clerk user fetched");

  // Ensure email exists
  const email = clerkUser.emailAddresses?.[0]?.emailAddress;
  if (!email) {
    return res
      .status(400)
      .json({ error: "Cannot create user: no email found from Clerk" });
  }

  // Generate username safely
  let username = clerkUser.firstName
    ? `${clerkUser.firstName.toLowerCase()}${Math.floor(Math.random() * 1000)}`
    : email.split("@")[0].toLowerCase();

  // Make sure username is unique in DB
  let usernameExists = await User.findOne({ username });
  while (usernameExists) {
    username = `${username}${Math.floor(Math.random() * 1000)}`;
    usernameExists = await User.findOne({ username });
  }

  const userData = {
    clerkId: userId,
    email,
    firstName: clerkUser.firstName || "",
    lastName: clerkUser.lastName || "",
    username,
    profilePicture: clerkUser.imageUrl || "",
  };

  const user = await User.create(userData);
  console.log("User created in DB");

  res.status(201).json({ user, message: "User created successfully" });
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

  res.status(200).json({
    message: isFollowing
      ? "User unfollowed successfully"
      : "User followed successfully",
  });
});
