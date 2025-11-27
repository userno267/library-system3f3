import express from "express";
import { borrowBook, returnBook, getUserBorrows, getAllBorrows } from "../controllers/borrowController.js";

const router = express.Router();

router.post("/borrow/:id", borrowBook);
router.post("/return/:id", returnBook);
router.get("/:userId", getUserBorrows);

// ADMIN: Get all borrow records
router.get("/", getAllBorrows);

export default router;
