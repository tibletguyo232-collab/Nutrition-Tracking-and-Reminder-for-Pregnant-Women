const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
    {
  title: { type: String, required: true },
  category: { type: String, enum: ["Nutrition", "Hydration", "Medication", "Appointment", "Exercise"], required: true },
  datetime: { type: Date, required: true },
  repeat: { type: String, enum: ["once", "daily", "weekly"], default: "once" },
  channel: { type: String, enum: ["push", "email", "sms"], default: "push" },
  notes: { type: String },
  status: { type: String, enum: ["pending", "done", "overdue"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Reminder", reminderSchema);
const mongoose = require("mongoose");

const ReminderSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    category: { type: String },
    status: { type: String, enum: ["pending", "done"], default: "pending" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reminder", ReminderSchema);
