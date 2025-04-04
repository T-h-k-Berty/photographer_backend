const { Portfolio, Gallery, Package, User } = require("../models");

exports.createPortfolio = async (req, res) => {
  try {
    const {
      userId,
      shopName,
      photographerName,
      description,
      selectedEvents,
      locations,
      galleries,
      packages,
    } = req.body;

    const profilePicture = req.files?.find(f => f.fieldname === "profilePicture")?.filename || null;
    const backgroundPicture = req.files?.find(f => f.fieldname === "backgroundPicture")?.filename || null;

    const parsedGalleries = JSON.parse(galleries);
    const parsedPackages = JSON.parse(packages);

    const portfolio = await Portfolio.create({
      userId,
      shopName,
      photographerName,
      description,
      profilePicture,
      backgroundPicture, // ✅ Use the corrected variable here
      selectedEvents: JSON.parse(selectedEvents),
      locations: JSON.parse(locations),
    });


    for (let i = 0; i < parsedGalleries.length; i++) {
      const g = parsedGalleries[i];

      const getPhoto = (fieldName) => {
        const file = req.files.find(f => f.fieldname === fieldName);
        return file ? file.filename : "";
      };

      const galleryData = {
        portfolioId: portfolio.id,
        eventType: g.eventType,
        description: g.description,
        photo1: getPhoto(`galleryPhotos[${i}][photo1]`),
        photo2: getPhoto(`galleryPhotos[${i}][photo2]`),
        photo3: getPhoto(`galleryPhotos[${i}][photo3]`),
      };

      await Gallery.create(galleryData);
    }

    for (let p of parsedPackages) {
      await Package.create({
        portfolioId: portfolio.id,
        title: p.title,
        description: p.description,
        price: p.price,
      });
    }

    res.status(201).json({ message: "Portfolio created successfully" });
  } catch (err) {
    console.error("❌ Error in createPortfolio:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.findAll({
      include: [Gallery, Package],
    });
    res.json(portfolios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.id, {
      include: [Gallery, Package],
    });
    if (!portfolio) return res.status(404).json({ message: "Not found" });
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.id);
    if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });

    await portfolio.update(req.body);
    res.json({ message: "Portfolio updated", portfolio });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.id);
    if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });

    await portfolio.destroy();
    res.json({ message: "Portfolio deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// ✅ Add this to portfolioController.js

exports.getPortfolioByUserId = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      where: { userId: req.params.userId },
      include: [Gallery, Package, User], // ✅ Include User model to access rating
    });

    if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });

    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

