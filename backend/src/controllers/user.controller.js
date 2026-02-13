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

// export const syncUser = asyncHanler(async (req, res) => {
//   const { userId } = getAuth(req);

//   //check if user alreday Exist in mongodb

//   const existingUser = await User.findOne({ clerkId: userId });
//   if (existingUser) {
//     return res
//       .status(200)
//       .json({ user: existingUser, message: "User alreday Exist" });
//   }

//   //Create new User from Clerk data
//   const clerkUser = await clerkClient.users.getUser(userId);

//   const userData = {
//     clerkId: userId,
//     email: clerkUser.emailAddresses[0].emailAddress,
//     firstName: clerkUser.firstName || "",
//     lastName: clerkUser.lastName || "",
//     username: clerkUser.emailAddresses[0].emailAddress.split("@")[0],
//     profilePicture: clerkUser.imageUrl || "",
//   };

//   const user = await User.create(userData);

//   res.status(201).json({ user, message: "User Created successfully" });
// });


export const syncUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized - missing user ID" });
  }

  const existingUser = await User.findOne({ clerkId: userId });
  if (existingUser) {
    return res.status(200).json({ user: existingUser, message: "User already exists" });
  }

  try {
    const clerkUser = await clerkClient.users.getUser(userId);
    if (!clerkUser) {
      return res.status(404).json({ error: "Clerk user not found" });
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) {
      return res.status(400).json({ error: "User email not found in Clerk" });
    }

    // Generate a unique username
    let baseUsername = email.split("@")[0];
    let username = baseUsername;
    let counter = 1;
    while (await User.findOne({ username })) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    // Prepare user data
    const userData = {
      clerkId: userId,
      email,
      firstName: clerkUser.firstName || "",
      lastName: clerkUser.lastName || "",
      username,
      profilePicture: clerkUser.imageUrl || "",
    };

    // Save user in DB
    const user = await User.create(userData);

    res.status(201).json({ user, message: "User created successfully" });

  } catch (error) {
    console.error("SyncUser error:", error);
    res.status(500).json({ error: "User sync failed", details: error.message });
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
