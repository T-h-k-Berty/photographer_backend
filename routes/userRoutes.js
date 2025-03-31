const express = require("express");
const User = require("../models/userModel");
const PATHS = require("../paths"); // ✅ Fix the import


const router = express.Router();

// Get All Users
router.get(PATHS.USERS.GET_ALL_USERS, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User by ID
router.get(PATHS.USERS.GET_USER_BY_ID, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
