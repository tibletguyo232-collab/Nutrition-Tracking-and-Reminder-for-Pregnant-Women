
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  // Basic user info
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // will be hashed
  age: Number,
  phone: String,
  address: String,

  // Pregnancy-related fields
  birthStatus: { 
    type: String, 
    enum: ["first", "second", "third", "fourth_or_more"], 
    required: true 
  },
  edd: Date,
  trimester: { type: String, enum: ["1", "2", "3"] },
  preWeight: Number,
  currentWeight: Number,
  height: Number,
  allergies: String,
  waterIntake: Number,
  activityLevel: { type: String, enum: ["sedentary", "light", "moderate", "active"] },
  chronicConditions: String,
  pastPregnancyIssues: String,
  supplements: String,
  bloodType: String,
  reminderMethod: { type: String, enum: ["sms", "email"] },

  // Nutrition tracking
  bmi: Number,
  conditions: [String],
  calorieLimit: Number,
  proteinMin: Number,
  dailyIntake: [
    {
      date: { type: Date, default: Date.now },
      meals: [
        {
          mealId: Number,
          time: String
        }
      ],
      totalCalories: Number,
      totalProtein: Number,
      totalCarbs: Number,
      totalFats: Number,
      totalSodium: Number
    }
  ],

  // Role-based access
  role: { type: String, enum: ["user", "admin"], default: "user" }

}, { timestamps: true });

//  Password Hashing 
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
