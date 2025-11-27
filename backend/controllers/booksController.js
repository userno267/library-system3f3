import db from "../db.js";

// Get all books
export const getAllBooks = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT books.*, categories.name AS category_name
      FROM books
      LEFT JOIN categories ON books.category_id = categories.id
      ORDER BY books.id DESC
    `);

    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get single book
export const getBook = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT books.*, categories.name AS category_name
      FROM books
      LEFT JOIN categories ON books.category_id = categories.id
      WHERE books.id = ?
    `, [req.params.id]);

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Create book
export const createBook = async (req, res) => {
  try {
    const { title, author, description, category_id, is_ebook, copies } = req.body;
    const pdf_path = req.file ? req.file.filename : null;

    const [result] = await db.query(
      `INSERT INTO books 
        (title, author, description, category_id, is_ebook, pdf_path, copies) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        author,
        description,
        category_id,
        is_ebook === "true" ? 1 : 0,
        pdf_path,
        copies,
      ]
    );

    const [rows] = await db.query("SELECT * FROM books WHERE id = ?", [result.insertId]);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("CREATE BOOK ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update book
export const updateBook = async (req, res) => {
  try {
    const { title, author, description, category_id, is_ebook, copies } = req.body;
    const pdf_path = req.file ? req.file.filename : req.body.pdf_path || null;

    await db.query(
      `UPDATE books SET 
        title=?, author=?, description=?, category_id=?, is_ebook=?, pdf_path=?, copies=? 
        WHERE id=?`,
      [
        title,
        author,
        description,
        category_id,
        is_ebook === "true" ? 1 : 0,
        pdf_path,
        copies,
        req.params.id,
      ]
    );

    const [rows] = await db.query("SELECT * FROM books WHERE id=?", [req.params.id]);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("UPDATE BOOK ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete book
export const deleteBook = async (req, res) => {
  try {
    await db.query("DELETE FROM books WHERE id=?", [req.params.id]);
    res.json({ success: true, message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Borrow book (copies - 1)
export const borrowBook = async (req, res) => {
  try {
    const { book_id } = req.body;

    const [rows] = await db.query("SELECT * FROM books WHERE id = ?", [book_id]);
    const book = rows[0];

    if (!book)
      return res.status(404).json({ success: false, message: "Book not found" });

    if (book.is_ebook)
      return res.status(400).json({ success: false, message: "eBooks cannot be borrowed" });

    if (book.copies <= 0)
      return res.status(400).json({ success: false, message: "No copies available" });

    const newCopies = book.copies - 1;

    await db.query("UPDATE books SET copies=? WHERE id=?", [newCopies, book_id]);

    res.json({ success: true, message: "Book borrowed successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Return book (copies + 1)
export const returnBook = async (req, res) => {
  try {
    const { book_id } = req.body;

    const [rows] = await db.query("SELECT * FROM books WHERE id = ?", [book_id]);
    const book = rows[0];

    if (!book)
      return res.status(404).json({ success: false, message: "Book not found" });

    if (book.is_ebook)
      return res.status(400).json({ success: false, message: "eBooks cannot be returned" });

    const newCopies = book.copies + 1;

    await db.query("UPDATE books SET copies=? WHERE id=?", [newCopies, book_id]);

    res.json({ success: true, message: "Book returned successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
