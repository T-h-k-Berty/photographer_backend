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
  backgroundPicture: DataTypes.STRING,
  description: DataTypes.TEXT,
  selectedEvents: DataTypes.JSON,
  locations: DataTypes.JSON,
  facebook: DataTypes.STRING,
  instagram: DataTypes.STRING,
  twitter: DataTypes.STRING,
  whatsapp: DataTypes.STRING,
});

module.exports = Portfolio;
