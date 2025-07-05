const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Booking = sequelize.define("Booking", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  clientId: { type: DataTypes.INTEGER, allowNull: false }, // User making the booking
  photographerId: { type: DataTypes.INTEGER, allowNull: false }, // User being booked
  name: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  time: { type: DataTypes.STRING, allowNull: false },
  eventType: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  phone: { type: DataTypes.STRING, allowNull: false },
  status: { // 'pending', 'accepted', 'canceled'
    type: DataTypes.ENUM("pending", "accepted", "canceled"),
    defaultValue: "pending",
    allowNull: false,
  },
}, {
  tableName: "bookings",
  timestamps: true,
});

module.exports = Booking;
