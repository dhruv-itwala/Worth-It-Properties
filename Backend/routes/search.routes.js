// routes/search.routes.js
import express from "express";
import searchController from "../controllers/search.controller.js";

const searchRoutes = express.Router();

searchRoutes.get("/properties", searchController.search);

export default searchRoutes;
