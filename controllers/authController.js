const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const sendOTPEmail = require("../utils/mailer"); // ✅ NEW
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      profilePicture: req.file ? req.file.path : null,
      isActive: true,
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (Number(user.isActive) !== 1) {
      return res.status(403).json({ message: "Your account is not active. Please contact support." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        isActive: user.isActive,
      },
      message: "Login successful!",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Send OTP
exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) return res.status(404).json({ message: "Email not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

  user.otp = otp;
  user.otpExpiry = expiry;
  await user.save();

  await sendOTPEmail(email, otp);
  return res.json({ message: "OTP sent to your email" });
};

// ✅ Verify OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user || user.otp !== otp || new Date() > user.otpExpiry) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  return res.json({ message: "OTP verified" });
};

// ✅ Reset Password
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user || user.otp !== otp || new Date() > user.otpExpiry) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  return res.json({ message: "Password reset successful" });
};
