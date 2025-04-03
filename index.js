const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes"); // ✅ Import portfolio routes
const PATHS = require("./paths");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); // Serve uploaded files

// Routes
app.use(PATHS.AUTH.BASE, authRoutes);
app.use(PATHS.USERS.BASE, userRoutes);
app.use("/api/portfolios", portfolioRoutes); // ✅ Register portfolio route

// Sync Database
sequelize.sync({ alter: true }).then(() => console.log("✅ Database synced"));

// Export for server.js
module.exports = app;
