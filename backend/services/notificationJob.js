// services/notificationJob.js
import cron from "node-cron";
import db from "../db.js";

export const notificationJob = () => {
  // runs every day at 9am
  cron.schedule("* * * * *", async () => {
    console.log("Running notification job...");

    try {
      const [rows] = await db.query(`
        SELECT br.id AS borrow_id, br.user_id, b.title, br.borrow_date
        FROM borrow_records br
        JOIN books b ON br.book_id = b.id
        WHERE br.status='borrowed'
      `);

      const now = new Date();

      for (const br of rows) {
        const borrowDate = new Date(br.borrow_date);
        const diffDays = Math.floor((now - borrowDate) / (1000 * 60 * 60 * 24));

        let type, message;

       if (diffDays >= 3 && diffDays < 5) {
  type = "reminder";
  message = `Reminder: Please return "${br.title}" before the 5-day limit.`;
}
else if (diffDays >= 5) {
  type = "overdue";
  message = `Overdue: You failed to return "${br.title}". A fine may apply.`;
}
        if (type) {
          // insert notification if not already exists for this borrow/type
          await db.query(`
            INSERT INTO notifications (user_id, borrow_id, type, message)
            SELECT ?, ?, ?, ?
            WHERE NOT EXISTS (
              SELECT 1 FROM notifications WHERE borrow_id=? AND type=?
            )
          `, [br.user_id, br.borrow_id, type, message, br.borrow_id, type]);
        }
      }

      console.log("Notification job finished.");
    } catch (err) {
      console.error("Error in notification job:", err);
    }
  });
};
