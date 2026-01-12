import express from "express";
import { getPosts ,getPost,getUserPosts} from "../controllers/post.controller";

const router = express.Router();

//public route

router.get("/", getPosts);
router.get("/:postId", getPost);
//GetPost data using UserName
router.get("/user:username",getUserPosts)


export default router;
