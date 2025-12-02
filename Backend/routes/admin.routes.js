import express from "express";
import AdminController from "../controllers/admin.controller.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

// ----- PUBLIC -----
router.post("/login", AdminController.login);

// ----- PROTECTED -----
router.use(adminAuthMiddleware);

router.get("/me", AdminController.getMe);
router.post("/logout", AdminController.logout);

// USER MANAGEMENT
router.get("/users", AdminController.listUsers);
router.put("/users/:id", AdminController.updateUser);
router.delete("/users/:id", AdminController.deleteUser);

export default router;
