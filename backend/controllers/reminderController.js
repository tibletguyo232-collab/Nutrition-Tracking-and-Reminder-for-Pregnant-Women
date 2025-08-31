
//  Get all reminders (only user’s) 
// Get reminders (all for user or by supplement)
// Get all reminders (including supplement-linked) for the logged-in user
exports.getAllReminders = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch reminders, both standalone and supplement-linked
    const reminders = await Reminder.find({ user: userId })
      .populate("supplement", "name dosage times"); // optional: fetch supplement info

    res.json(reminders);
  } catch (err) {
    console.error("Error fetching reminders:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Create new reminder 
exports.createReminder = async (req, res) => {
  try {
    const { title, description, datetime, category, status, supplementId } = req.body;

    const newReminder = new Reminder({
      title,
      description,
      datetime: datetime ? new Date(datetime) : new Date(),
      category,
      status: status || "pending",
      user: req.user.id,
      supplement: supplementId || null
    });

    await newReminder.save();
    res.status(201).json(newReminder);
  } catch (err) {
    console.error("Error creating reminder:", err);
    res.status(500).json({ message: "Server error", error: err.message });
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
