const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("./models/userModel.cjs");

const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // user ID and email stored in token
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Example protected update route
router.post("/", verifyToken, async (req, res) => {
  const { email } = req.user;
  const { username } = req.body;

  try {
    const user = await User.findOneAndUpdate({ email }, { username }, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Profile updated", user });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;