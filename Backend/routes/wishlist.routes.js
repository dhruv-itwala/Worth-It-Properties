import express from "express";
import User from "../models/User.model.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).populate("favouriteProperties");
  res.json({ success: true, favourites: user.favouriteProperties });
});

router.post("/toggle/:id", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  const propertyId = req.params.id;

  if (user.favouriteProperties.includes(propertyId)) {
    user.favouriteProperties.pull(propertyId);
  } else {
    user.favouriteProperties.push(propertyId);
  }

  await user.save();
  res.json({ success: true });
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  user.favouriteProperties.pull(req.params.id);
  await user.save();
  res.json({ success: true });
});

export default router;
