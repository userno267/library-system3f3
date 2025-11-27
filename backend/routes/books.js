import express from "express";
import {
  getAllBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
} from "../controllers/booksController.js";

import upload from "../middleware/upload.js"; // multer

const router = express.Router();

router.get("/", getAllBooks);
router.get("/:id", getBook);

// Use `upload.single("pdf")` for add/edit
router.post("/", upload.single("pdf"), createBook);
router.put("/:id", upload.single("pdf"), updateBook);

router.delete("/:id", deleteBook);

// Borrow / Return


export default router;
