import asyncHandler from "express-async-handler";
import Post from "../models/post.model.js";

export const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate("user", "username firstname lastname profilepicture")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username firstname lastname profilepicture",
      },
    });

  res.status(200).json({ posts });
});
