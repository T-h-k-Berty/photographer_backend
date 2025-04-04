const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const PATHS = require("./paths");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use(PATHS.AUTH.BASE, authRoutes);
app.use(PATHS.USERS.BASE, userRoutes);
app.use("/api/portfolios", portfolioRoutes);

sequelize.sync({ alter: true }).then(() => console.log("✅ DB Synced"));

module.exports = app;
