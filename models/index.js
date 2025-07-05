const User = require("./userModel");
const Portfolio = require("./portfolioModel");
const Gallery = require("./galleryModel");
const Package = require("./packageModel");
const EventSchedule = require("./eventScheduleModel"); // Add this line
const Booking = require("./bookingModel");
const Notification = require("./notificationModel");


Portfolio.belongsTo(User, { foreignKey: "userId" });


Portfolio.hasMany(Gallery, { foreignKey: "portfolioId", onDelete: "CASCADE" });
Portfolio.hasMany(Package, { foreignKey: "portfolioId", onDelete: "CASCADE" });
EventSchedule.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(EventSchedule, { foreignKey: "userId", onDelete: "CASCADE" });

// Booking associations
Booking.belongsTo(User, { as: "Client", foreignKey: "clientId" });
Booking.belongsTo(User, { as: "Photographer", foreignKey: "photographerId" });
User.hasMany(Booking, { as: "BookingsMade", foreignKey: "clientId" });
User.hasMany(Booking, { as: "BookingsReceived", foreignKey: "photographerId" });
User.hasOne(Portfolio, { as: "Portfolio", foreignKey: "userId" });
Portfolio.belongsTo(User, { foreignKey: "userId" });

// Notification associations
Notification.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Notification, { foreignKey: "userId" });

Gallery.belongsTo(Portfolio, { foreignKey: "portfolioId" });
Package.belongsTo(Portfolio, { foreignKey: "portfolioId" });

module.exports = { User, Portfolio, Gallery, Package, EventSchedule, Booking, Notification };
