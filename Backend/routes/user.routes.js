import express from "express";
import userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../config/multer.config.js";

const router = express.Router();

router.get("/me", authMiddleware, userController.getMe);

router.put(
  "/complete-profile",
  authMiddleware,
  upload.single("photo"),
  userController.completeProfile
);

export default router;
