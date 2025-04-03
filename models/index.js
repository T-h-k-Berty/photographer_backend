const User = require("./userModel");
const Portfolio = require("./portfolioModel");
const Gallery = require("./galleryModel");
const Package = require("./packageModel");

Portfolio.belongsTo(User, { foreignKey: "userId" });
Portfolio.hasMany(Gallery, { foreignKey: "portfolioId", onDelete: "CASCADE" });
Portfolio.hasMany(Package, { foreignKey: "portfolioId", onDelete: "CASCADE" });

Gallery.belongsTo(Portfolio, { foreignKey: "portfolioId" });
Package.belongsTo(Portfolio, { foreignKey: "portfolioId" });

module.exports = { User, Portfolio, Gallery, Package };
