// routes/user.routes.js
import express from "express";
import userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../config/multer.config.js";

const userRoutes = express.Router();

userRoutes.get("/me", authMiddleware, userController.getMe);

userRoutes.put(
  "/complete-profile",
  authMiddleware,
  userController.completeProfile
);

userRoutes.put(
  "/update-photo",
  authMiddleware,
  upload.single("photo"),
  userController.updatePhoto
);

export default userRoutes;
