const express = require("express");
const router = express.Router();
const reminderController = require("../controllers/reminderController");
const authMiddleware = require("../middleware/authMiddleware"); 

router.get("/", authMiddleware, reminderController.getReminders);
router.post("/", authMiddleware, reminderController.createReminder);
router.put("/:id", authMiddleware, reminderController.updateReminder);
router.delete("/:id", authMiddleware, reminderController.deleteReminder);

module.exports = router;
