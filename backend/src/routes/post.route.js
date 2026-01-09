import express from "express";
import { getPosts ,getPost} from "../controllers/post.controller";

const router = express.Router();

//public route

router.get("/", getPosts);
router.get("/:postId", getPost);


export default router;
