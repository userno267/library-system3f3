import pool from "../db.js";

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM categories ORDER BY id DESC");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Name required" });

    // Check if already exists
    const [existing] = await pool.execute("SELECT * FROM categories WHERE name=?", [name]);
    if (existing.length > 0) return res.json({ success: true, data: existing[0] });

    // Insert
    const [result] = await pool.execute("INSERT INTO categories (name) VALUES (?)", [name]);
    const [newCategory] = await pool.execute("SELECT * FROM categories WHERE id=?", [result.insertId]);

    res.status(201).json({ success: true, data: newCategory[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
