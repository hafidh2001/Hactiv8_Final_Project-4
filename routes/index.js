import { Router } from "express";
import userRoutes from "./userRoutes.js";
import photoRoutes from "./photoRoutes.js";
import socialmediaRoutes from "./socialmediaRoutes.js";
import commentRoutes from "./commentRoutes.js";
import { authentication } from "../middlewares/authentication.js";

const router = Router();

// make route
router.get("/", (req, res) => {
  res.send("Hactive8 - Final Project 4");
});

// create same-endpoint
router.use("/users", userRoutes);
router.use(authentication);
router.use("/photos", photoRoutes);
router.use("/comments", commentRoutes);
router.use("/socialmedias", socialmediaRoutes);

export default router;
