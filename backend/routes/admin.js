import express from "express";
import { getAIInsights } from "../controllers/adminAIController.js";

import pool from "../db.js";  // ✅ Import the DB connection

const router = express.Router();
router.post("/ai-insights", getAIInsights);
// POST /api/admin/send-test-notification/:userId
router.post("/send-test-notification/:userId", async (req, res) => {
  const { userId } = req.params;
  const { message } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO notifications (user_id, type, message, is_read) VALUES (?, 'test', ?, 0)`,
      [userId, message || "This is a test notification"]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("Error creating test notification:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
