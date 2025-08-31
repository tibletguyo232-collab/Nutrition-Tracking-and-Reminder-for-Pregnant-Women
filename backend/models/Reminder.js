const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    supplement: { type: mongoose.Schema.Types.ObjectId, ref: "Supplement", default: null },

    // Common fields
    title: { type: String, required: true },
    category: { 
      type: String, 
      enum: ["Nutrition", "Hydration", "Medication", "Appointment", "Exercise"], 
      required: true 
    },
    description: { type: String },       // optional description/notes
    notes: { type: String },             // optional notes
    datetime: { type: Date, required: true },
    date: { type: Date },                // optional separate date if needed
    repeat: { type: String, enum: ["once", "daily", "weekly"], default: "once" },
    channel: { type: String, enum: ["push", "email", "sms"], default: "push" },
    status: { type: String, enum: ["pending", "done", "overdue"], default: "pending" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // linked user
  },
  { timestamps: true }
);

// Export model safely
module.exports = mongoose.models.Reminder || mongoose.model("Reminder", reminderSchema);
