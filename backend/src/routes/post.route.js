import express from "express";
import { getPosts } from "../controllers/post.controller";

const router = express.Router();

//public route

router.get("/", getPosts);

export default router;
