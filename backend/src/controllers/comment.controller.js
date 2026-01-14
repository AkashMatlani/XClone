import asyncHandler from "express-async-handler";
import Comment from "../models/comment.model";
import { getAuth } from "@clerk/express";
import User from "../models/user.model";
import Post from "../models/post.model";
import Notification from "../models/notification.model";

export const getComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: -1 })
    .populate("user", "username firstname lastname profilePicture");

  res.status(200).json({ comments });
});

export const createComment = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { postId } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    res.status(400).json({ error: "Comment content is required" });
  }

  const user = await User.findOne({ clerkId: userId });
  const post = await Post.findById(postId);

  if (!user || !post)
    return res.status(404).json({ error: "User or Post not found" });

  const comment = await Comment.create({
    user: user._id,
    post: postId,
    content,
  });

  //link comment to the post
  await Post.findByIdAndUpdate(postId, {
    $push: { comments: comment._id },
  });

  //create notification if not connecting on own post

  if (post.user.toString() !== user._id.toString()) {
    await Notification.create({
      from: user._id,
      to: post.user,
      type: "comment",
      post: postId,
      comment: comment._id,
    });
  }

  res.status(201).json({ comment });
});
