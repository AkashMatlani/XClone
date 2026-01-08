import asyncHanler from "express-async-handler";
import User from "../models/user.model.js";
export const getUserProfile = asyncHanler(async (req, res) => {
  const { userName } = req.params;
  const user = await User.findOne({ userName });
  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ user });
});
