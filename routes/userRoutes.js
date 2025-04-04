const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const { getAllPhotographers, ratePhotographer } = require("../controllers/userController");

// IMPORTANT: Specific routes go BEFORE dynamic :id
router.get("/photographers", getAllPhotographers);
router.post("/rate/:photographerId", ratePhotographer);

router.get("/all", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
