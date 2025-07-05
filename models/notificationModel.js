const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Notification = sequelize.define("Notification", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false }, // The receiver of the notification
  message: { type: DataTypes.STRING, allowNull: false },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  type: { type: DataTypes.STRING }, // e.g., 'booking', 'status'
  bookingId: { type: DataTypes.INTEGER }, // <--- Add this for booking-related notifications
}, {
  tableName: "notifications",
  timestamps: true,
});


module.exports = Notification;
