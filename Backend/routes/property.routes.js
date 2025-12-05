// routes/property.routes.js
import express from "express";
import PropertyController from "../controllers/property.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { upload } from "../config/multer.config.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  requireRole("owner", "builder", "broker"),
  upload.fields([
    { name: "images", maxCount: 8 },
    { name: "video", maxCount: 1 },
  ]),
  PropertyController.create
);

router.get("/", PropertyController.getAll);
router.get("/:id", PropertyController.getOne);
router.get("/user/:userId", PropertyController.getUserProperties);

router.put("/:id", authMiddleware, PropertyController.update);
router.delete("/:id", authMiddleware, PropertyController.delete);

export default router;
