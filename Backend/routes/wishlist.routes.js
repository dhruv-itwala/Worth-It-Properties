// routes/wishlist.routes.js
import express from "express";
import wishlistController from "../controllers/wishlist.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const wishlistRoutes = express.Router();

wishlistRoutes.use(authMiddleware);

// GET all wishlist
wishlistRoutes.get("/", wishlistController.getAll);

// TOGGLE add/remove
wishlistRoutes.post("/toggle/:propertyId", wishlistController.toggle);

// REMOVE explicitly
wishlistRoutes.delete("/:propertyId", wishlistController.remove);

export default wishlistRoutes;
