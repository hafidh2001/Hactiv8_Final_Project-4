import {
  createPhoto,
  showPhotos,
  updatePhoto,
  deletePhoto,
} from "../controllers/photoController.js";
import { Router } from "express";

const router = Router();

router.post("/", createPhoto);
router.get("/", showPhotos);
router.put("/:photoId", updatePhoto);
router.delete("/:photoId", deletePhoto);

export default router;
