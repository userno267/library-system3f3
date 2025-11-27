import express from "express";
import { getCategories, createCategory } from "../controllers/categoriesController.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", createCategory); // ← This is missing now

export default router;
