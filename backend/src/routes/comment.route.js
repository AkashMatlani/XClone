import express from "express";
import { getComments ,createComment,deleteComment} from "../controllers/comment.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

//public route

router.get("/post/:postId", getComments);


//protected route

router.post("/post/:postId",protectRoute,createComment);
router.delete("/postId",protectRoute,deleteComment)

export default router;
