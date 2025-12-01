// routes/auth.routes.js
import express from "express";
import AuthController from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/google", AuthController.googleLogin);
authRoutes.get("/me", authMiddleware, AuthController.getMe);
authRoutes.post("/logout", authMiddleware, AuthController.logout);

export default authRoutes;
