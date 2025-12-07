import express from "express";
import userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { uploadProfile } from "../config/multer.profile.js";

const router = express.Router();

router.get("/me", authMiddleware, userController.getMe);

router.put(
  "/complete-profile",
  authMiddleware,
  uploadProfile.single("photo"),
  userController.completeProfile
);

export default router;
