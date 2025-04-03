const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Portfolio = sequelize.define("Portfolio", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  shopName: DataTypes.STRING,
  photographerName: DataTypes.STRING,
  profilePicture: DataTypes.STRING,
  backgroundPicture: DataTypes.STRING, // ✅ Added field
  description: DataTypes.TEXT,
  selectedEvents: DataTypes.JSON,
  locations: DataTypes.JSON,
});

module.exports = Portfolio;
