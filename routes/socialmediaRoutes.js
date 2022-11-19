import {
  createSocialMedia,
  showSocialMedias,
  updateSocialMedia,
  deleteSocialMedia,
} from "../controllers/socialMediaController.js";
import { Router } from "express";

const router = Router();

router.post("/", createSocialMedia);
router.get("/", showSocialMedias);
router.put("/:socialMediaId", updateSocialMedia);
router.delete("/:socialMediaId", deleteSocialMedia);

export default router;
