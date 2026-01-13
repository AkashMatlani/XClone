import express from "express";
import { getPosts ,getPost,getUserPosts,createPost,likePost} from "../controllers/post.controller";
import {protectRoute} from "../middleware/auth.middleware"
import upload from "../middleware/upload.middleware";

const router = express.Router();

//public route

router.get("/", getPosts);
router.get("/:postId", getPost);
//GetPost data using UserName
router.get("/user:username",getUserPosts);

//protected 

router.post("/",protectRoute,upload.single("image"),createPost);
router.post("/postId/like",protectRoute,likePost);


export default router;
