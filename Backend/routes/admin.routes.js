import express from "express";
import AdminController from "../controllers/admin.controller.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";

const adminRoutes = express.Router();

// Public admin login
adminRoutes.post("/login", AdminController.login);

// Protected admin routes
adminRoutes.use(adminAuthMiddleware);

adminRoutes.post("/logout", AdminController.logout);

adminRoutes.get("/users", AdminController.listUsers);
adminRoutes.put("/users/:id", AdminController.updateUser);
adminRoutes.delete("/users/:id", AdminController.deleteUser);

adminRoutes.get("/properties", AdminController.listProperties);
adminRoutes.put("/properties/:id", AdminController.updateProperty);
adminRoutes.put("/properties/:id/publish", AdminController.publishProperty);
adminRoutes.delete("/properties/:id", AdminController.deleteProperty);

export default adminRoutes;
