import express from "express";
import AuthController from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/google", AuthController.googleLogin); // google token
router.post("/login", AuthController.login); // email+password (users)
router.get("/me", authMiddleware, AuthController.getMe); // returns req.user
router.post("/logout", authMiddleware, AuthController.logout);

export default router;
