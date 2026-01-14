import asyncHandler from "express-async-handler";
import Comment from "../models/comment.model";

export const getComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: -1 })
    .populate("user", "username firstname lastname profilePicture");

  res.status(200).json({ comments });
});
