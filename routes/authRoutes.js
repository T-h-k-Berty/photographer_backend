const express = require("express");
const { register, login } = require("../controllers/authController");
const multer = require("multer");

const router = express.Router();

// ✅ Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ Registration Route with File Upload
router.post("/register", upload.single("profilePicture"), async (req, res) => {
  try {
    if (!req.body.name || !req.body.email || !req.body.password || !req.body.role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    await register(req, res);
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

// ✅ Login Route with Error Handling
router.post("/login", async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    await login(req, res);
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

module.exports = router;
