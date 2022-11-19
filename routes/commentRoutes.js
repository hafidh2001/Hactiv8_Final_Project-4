import {
  createComment,
  showComments,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";
import { Router } from "express";

const router = Router();

router.post("/", createComment);
router.get("/", showComments);
router.put("/:commentId", updateComment);
router.delete("/:commentId", deleteComment);

export default router;
