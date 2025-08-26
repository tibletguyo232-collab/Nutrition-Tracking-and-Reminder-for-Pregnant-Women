const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
exports.register = async (req, res) => {
  try {
    const {
      name, email, password, age, phone, address,
      birthStatus, edd, trimester, preWeight, currentWeight, height,
      allergies, waterIntake, activityLevel,
      chronicConditions, pastPregnancyIssues, supplements, bloodType,
      reminderMethod
    } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    user = new User({
      name, email, password: hashedPassword, age, phone, address,
      birthStatus, edd, trimester, preWeight, currentWeight, height,
      allergies, waterIntake, activityLevel,
      chronicConditions, pastPregnancyIssues, supplements, bloodType,
      reminderMethod
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        phone: user.phone,
        reminderMethod: user.reminderMethod
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
