const User = require("./userModel");
const Portfolio = require("./portfolioModel");
const Gallery = require("./galleryModel");
const Package = require("./packageModel");
const EventSchedule = require("./eventScheduleModel");
const Booking = require("./bookingModel");
const Notification = require("./notificationModel");

// User-Portfolio
User.hasMany(Portfolio, { foreignKey: "userId", onDelete: "CASCADE" });
Portfolio.belongsTo(User, { foreignKey: "userId" });
User.hasOne(Portfolio, { as: "Portfolio", foreignKey: "userId" }); // For singular fetch

// Portfolio-Gallery/Package
Portfolio.hasMany(Gallery, { foreignKey: "portfolioId", onDelete: "CASCADE" });
Portfolio.hasMany(Package, { foreignKey: "portfolioId", onDelete: "CASCADE" });
Gallery.belongsTo(Portfolio, { foreignKey: "portfolioId" });
Package.belongsTo(Portfolio, { foreignKey: "portfolioId" });

// User-EventSchedule
User.hasMany(EventSchedule, { foreignKey: "userId", onDelete: "CASCADE" });
EventSchedule.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

// Bookings
User.hasMany(Booking, { as: "BookingsMade", foreignKey: "clientId" });
User.hasMany(Booking, { as: "BookingsReceived", foreignKey: "photographerId" });
Booking.belongsTo(User, { as: "Client", foreignKey: "clientId" });
Booking.belongsTo(User, { as: "Photographer", foreignKey: "photographerId" });

// Notifications
User.hasMany(Notification, { foreignKey: "userId", onDelete: "CASCADE" });
Notification.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  User,
  Portfolio,
  Gallery,
  Package,
  EventSchedule,
  Booking,
  Notification
};
