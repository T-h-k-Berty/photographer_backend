const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const EventSchedule = sequelize.define("EventSchedule", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false }, // Photographer's userId
  name: { type: DataTypes.STRING, allowNull: false },
  place: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  start: { type: DataTypes.STRING, allowNull: false }, // Time as string: "HH:mm"
  end: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: "event_schedules",
  timestamps: true,
});

module.exports = EventSchedule;
