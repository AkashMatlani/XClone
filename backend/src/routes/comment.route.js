import express from "express";
import { getComments } from "../controllers/comment.controller.js";

const router = express.Router();

//public route

router.get("/post/:postId", getComments);

export default router;
