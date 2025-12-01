import express from "express";
import propertyController from "../controllers/property.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { upload } from "../config/multer.config.js";

const propertyRoutes = express.Router();

const uploadFields = upload.fields([
  { name: "images", maxCount: 8 },
  { name: "video", maxCount: 1 },
]);

propertyRoutes.post(
  "/",
  authMiddleware,
  requireRole("owner", "builder"),
  uploadFields,
  propertyController.create
);

// IMPORTANT: Correct Order
propertyRoutes.get("/user/:userId", propertyController.getByUser);
propertyRoutes.get("/:id", propertyController.getById);

propertyRoutes.get("/", propertyController.getAll);

propertyRoutes.put("/:id", authMiddleware, propertyController.update);
propertyRoutes.delete("/:id", authMiddleware, propertyController.delete);

export default propertyRoutes;
