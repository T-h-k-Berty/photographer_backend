const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const PATHS = require("./paths");


const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.use(PATHS.AUTH.BASE, authRoutes);
app.use(PATHS.USERS.BASE, userRoutes); // Register user routes

// Sync Database
sequelize.sync({ alter: true }).then(() => console.log("Database synced"));

// Export app so `server.js` can use it
module.exports = app;
