const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Package = sequelize.define("Package", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  portfolioId: { type: DataTypes.INTEGER, allowNull: false },
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  price: DataTypes.STRING,
});

module.exports = Package;