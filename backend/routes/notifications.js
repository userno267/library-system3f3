// routes/notifications.js
import express from "express";
import { getUserNotifications, markAsRead } from "../controllers/notificationController.js";
const router = express.Router();

router.get("/:userId", getUserNotifications);
router.post("/read/:notificationId", markAsRead);

export default router;
