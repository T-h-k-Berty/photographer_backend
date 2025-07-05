const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const PATHS = require("./paths");
const eventScheduleRoutes = require("./routes/eventScheduleRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

app.use(cors());
app.use(express.json()); // << Ensure this is BEFORE any routes needing req.body
app.use("/uploads", express.static("uploads"));

// Register routes only once and after middleware
app.use("/api/events", eventScheduleRoutes);
app.use(PATHS.AUTH.BASE, authRoutes);
app.use(PATHS.USERS.BASE, userRoutes);
app.use("/api/portfolios", portfolioRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/notifications", notificationRoutes);

sequelize.sync({ alter: true }).then(() => console.log("✅ DB Synced"));

module.exports = app;
