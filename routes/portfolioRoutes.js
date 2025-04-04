const express = require("express");
const multer = require("multer");
const {
  createPortfolio,
  getAllPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
  getPortfolioByUserId,
} = require("../controllers/portfolioController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/", upload.any(), createPortfolio);
router.get("/", getAllPortfolios);
router.get("/:id", getPortfolioById);
router.put("/:id", upload.any(), updatePortfolio);
router.delete("/:id", deletePortfolio);
// In portfolioRoutes.js
router.get("/user/:userId", getPortfolioByUserId); // ✅ Add this line above `/:id`



module.exports = router;
