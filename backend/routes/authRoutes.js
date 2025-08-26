const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

router.post("/register", (req, res) => {
  res.send("User registered");
});

router.post("/login", (req, res) => {
  res.send("User logged in");
});

module.exports = router;
