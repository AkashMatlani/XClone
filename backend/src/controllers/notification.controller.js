import { getAuth } from "@clerk/express";
import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const getNotifications =asyncHandler(async(requestAnimationFrame,res)=>{

    const {userId} =getAuth(req);
    const user= await User.findOne({clerkId:userId});

    if(!user) return res.status(404).json({error:"User not found"});

    const notification= await Notification.find(user{to: user._id})
    .sort({createdAt:-1})
    .populate("from","username firstname lastame profilePicture")
    .populate("post","content image")
    .populate("comment","content")

    res.status(200).json({notification})

});