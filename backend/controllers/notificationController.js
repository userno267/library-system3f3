// controllers/notificationController.js
import db from "../db.js";

export const getUserNotifications = async (req, res) => {
  const userId = req.params.userId;
  try {
    const [rows] = await db.query(
      "SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC",
      [userId]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const markAsRead = async (req, res) => {
  const { notificationId } = req.params;
  try {
    await db.query("UPDATE notifications SET is_read=1 WHERE id=?", [notificationId]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
