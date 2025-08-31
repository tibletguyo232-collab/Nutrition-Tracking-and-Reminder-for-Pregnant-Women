const jwt = require("jsonwebtoken");
const User = require("../models/User");

// -------------------- General Auth Middleware --------------------
exports.authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password -__v");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user; // attach user to request
    next();
  } catch (err) {
    console.error("JWT error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};


// -------------------- Admin Only Middleware --------------------
exports.adminOnly = async (req, res, next) => {
  // If user not attached, run authMiddleware first
  if (!req.user) {
    return exports.authMiddleware(req, res, async () => {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied: Admins only" });
      }
      next();
    });
  }

  // User already attached, just check role
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  next();
};


