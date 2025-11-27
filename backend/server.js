import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";   // ← ADD THIS
import pool from "./db.js";
import notificationRoutes from "./routes/notifications.js";
import testNotificationsRouter from "./routes/admin.js"; // or the new file

import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/books.js";
import categoryRoutes from "./routes/categories.js";
import borrowRoutes from "./routes/borrow.js";
import chatbotRoutes from "./routes/chatbot.js";
import adminRoutes from "./routes/admin.js";
import { notificationJob } from "./services/notificationJob.js";
notificationJob();

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🚀 STATIC FILES — THIS FIXES YOUR PDF ISSUE
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Test endpoint
app.get("/test", (req, res) => {
  res.send("API is running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/borrow", borrowRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", testNotificationsRouter);

// Test DB connection on startup
pool.getConnection()
  .then(() => console.log("Connected to MySQL database"))
  .catch(err => console.error("DB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
