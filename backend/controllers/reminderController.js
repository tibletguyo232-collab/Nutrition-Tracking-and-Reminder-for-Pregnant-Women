
//  Get all reminders (only user’s) 
exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Create new reminder 
exports.createReminder = async (req, res) => {
  try {
    const { title, description, date, category, status } = req.body;

    const newReminder = new Reminder({
      title,
      description,
      date,
      category,
      status: status || "pending",
      user: req.user.id
    });

    await newReminder.save();
    res.status(201).json(newReminder);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update reminder
exports.updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // only update if owned by user
      req.body,
      { new: true }
    );

    if (!reminder) return res.status(404).json({ error: "Reminder not found" });
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete reminder
exports.deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!reminder) return res.status(404).json({ error: "Reminder not found" });
    res.json({ msg: "Reminder deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
