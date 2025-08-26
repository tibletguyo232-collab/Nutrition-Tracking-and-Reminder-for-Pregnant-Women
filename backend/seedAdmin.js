const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash("AdminPass123", 10);

  const admin = new User({
    fullName: "Hospital Admin",
    email: "admin@hospital.com",
    password: hashedPassword,
    role: "admin"
  });

  await admin.save();
  console.log("Admin created:", admin.email);
  process.exit();
})();
