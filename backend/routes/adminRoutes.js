const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { adminOnly } = require("../middleware/authMiddleware");

// Stats
router.get("/stats", adminOnly, adminController.getStats);

// Manage users
router.get("/users", adminOnly, adminController.getUsers);
router.delete("/users/:id", adminOnly, adminController.deleteUser);

// Manage reminders
router.get("/reminders", adminOnly, adminController.getReminders);
router.post("/reminders", adminOnly, adminController.createReminder);

const { authMiddleware } = require("../middleware/authMiddleware");

// Only admins can access these routes
router.use(authMiddleware); // attach user from token
router.use((req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  next();
});

// Users
router.get("/users", adminController.getUsers);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);

// Reminders
router.get("/reminders", adminController.getReminders);
router.put("/reminders/:id", adminController.updateReminder);

// Supplements
router.get("/supplements", adminController.getSupplements);
router.post("/supplements", adminController.addSupplement);
router.put("/supplements/:id", adminController.updateSupplement);
router.delete("/supplements/:id", adminController.deleteSupplement);

// Reports / Analytics
router.get("/reports", adminController.getReports);

module.exports = router;
