const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Gallery = sequelize.define("Gallery", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  portfolioId: { type: DataTypes.INTEGER, allowNull: false },
  photo1: DataTypes.STRING,
  photo2: DataTypes.STRING,
  photo3: DataTypes.STRING,
  description: DataTypes.TEXT,
  eventType: DataTypes.STRING,
});

module.exports = Gallery;
