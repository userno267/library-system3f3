import db from "../db.js";

// Borrow a book (per user)
export const borrowBook = async (req, res) => {
  const bookId = req.params.id;
  const { user_id } = req.body;

  try {
    // Check if book exists
    const [books] = await db.query("SELECT * FROM books WHERE id=?", [bookId]);
    const book = books[0];
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });
    if (book.is_ebook) return res.status(400).json({ success: false, message: "eBooks cannot be borrowed" });
    if (book.copies <= 0) return res.status(400).json({ success: false, message: "No copies available" });

    // Check if user already borrowed this book
    const [existing] = await db.query(
      "SELECT * FROM borrow_records WHERE user_id=? AND book_id=? AND status='borrowed'",
      [user_id, bookId]
    );
    if (existing.length > 0)
      return res.status(400).json({ success: false, message: "You already borrowed this book" });

    // Insert borrow record
    await db.query(
      "INSERT INTO borrow_records (user_id, book_id, borrow_date, status) VALUES (?, ?, NOW(), 'borrowed')",
      [user_id, bookId]
    );

    // Decrement copies
    await db.query("UPDATE books SET copies = copies - 1 WHERE id=?", [bookId]);

    res.json({ success: true, message: "Book borrowed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Return a book (per user)
export const returnBook = async (req, res) => {
  const bookId = req.params.id;
  const { user_id } = req.body;

  try {
    // Check if user has borrowed this book
    const [borrowed] = await db.query(
      "SELECT * FROM borrow_records WHERE user_id=? AND book_id=? AND status='borrowed'",
      [user_id, bookId]
    );
    if (borrowed.length === 0)
      return res.status(400).json({ success: false, message: "You haven't borrowed this book" });

    // Update borrow record
    await db.query(
      "UPDATE borrow_records SET return_date=NOW(), status='returned' WHERE user_id=? AND book_id=? AND status='borrowed'",
      [user_id, bookId]
    );

    // Increment copies
    await db.query("UPDATE books SET copies = copies + 1 WHERE id=?", [bookId]);

    res.json({ success: true, message: "Book returned successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all books borrowed by a user
export const getUserBorrows = async (req, res) => {
  const userId = req.params.userId;
  try {
    const [rows] = await db.query(
      `SELECT br.id AS borrow_id, b.id AS book_id, b.title, b.author, b.is_ebook, b.pdf_path, b.copies, br.borrow_date, br.return_date, br.status
       FROM borrow_records br
       JOIN books b ON br.book_id = b.id
       WHERE br.user_id=? 
       ORDER BY br.borrow_date DESC`,
      [userId]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
// Get ALL borrow records (Admin)
export const getAllBorrows = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        br.id AS borrow_id,
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        b.id AS book_id,
        b.title AS book_title,
        br.borrow_date,
        br.return_date,
        br.status
      FROM borrow_records br
      JOIN users u ON br.user_id = u.id
      JOIN books b ON br.book_id = b.id
      ORDER BY br.borrow_date DESC
    `);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
