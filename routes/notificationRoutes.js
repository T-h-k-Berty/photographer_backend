const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authenticate = require("../middleware/authMiddleware"); // JWT/auth middleware

router.get("/", authenticate, notificationController.getNotifications);
router.put("/:notificationId/read", authenticate, notificationController.markAsRead);
router.put("/mark-all/read", authenticate, notificationController.markAllAsRead);

module.exports = router;
