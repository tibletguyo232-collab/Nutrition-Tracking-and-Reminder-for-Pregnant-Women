const express = require("express");
const router = express.Router();
const reminderController = require("../controllers/reminderController");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

//All users (authenticated)
router.get("/", authMiddleware, reminderController.getAllReminders);
router.post("/", authMiddleware, reminderController.createReminder);
router.put("/:id", authMiddleware, reminderController.updateReminder);
router.delete("/:id", authMiddleware, reminderController.deleteReminder);

// Admin-only routes
router.get("/all", authMiddleware, adminOnly, reminderController.getAllReminders);

module.exports = router;
