const { Notification } = require("../models");

// Get notifications for the logged-in user
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      // attributes: ["id", "message", "isRead", "createdAt", "type", "bookingId"], // If using custom fields
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark a single notification as read
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;
    const notification = await Notification.findOne({ where: { id: notificationId, userId } });
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    if (notification.isRead) {
      return res.status(200).json({ message: "Already marked as read" });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark all notifications as read for the logged-in user
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await Notification.update({ isRead: true }, { where: { userId, isRead: false } });
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
