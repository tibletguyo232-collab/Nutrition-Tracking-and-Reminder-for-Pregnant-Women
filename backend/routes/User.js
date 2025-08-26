const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Auth Middleware 
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error('JWT verification failed', err);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

// HEALTH CHECK 
router.get('/health', (req, res) => {
  res.json({ msg: "User service is running!" });
});

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ msg: "Full name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });

    res.status(201).json({ msg: "Registration successful", userId: newUser._id, token });
  } catch (err) {
    console.error("Error in /register:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });

    res.json({ msg: "Login successful", userId: user._id, token });
  } catch (err) {
    console.error("Error in /login:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// GET CURRENT USER PROFILE 
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error in /profile:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

//  GET USER BY ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error in GET /users/:id:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

//  UPDATE USER 
router.put('/users/:id', authMiddleware, async (req, res) => {
  try {
    const data = { ...req.body };
    delete data.password; 

    const user = await User.findByIdAndUpdate(req.params.id, data, { new: true }).select('-password');
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ msg: "Profile updated successfully", user });
  } catch (err) {
    console.error("Error in PUT /users/:id:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
