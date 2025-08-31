require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Directories
const frontendDir = path.join(__dirname, '..', 'frontend');
const pagesDir = path.join(frontendDir, 'pages');
const uploadDir = path.join(__dirname, 'upload', 'images');

// Middleware
app.use(cors());
app.use(express.json());

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueSuffix);
  }
});
const upload = multer({ storage });

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/reminders", require("./routes/reminderRoutes"));
app.use("/api/users", require("./routes/user"));
app.use("/api/supplements", require("./routes/SupplementRoutes"));

// Health check
app.get('/api', (req, res) => res.send('Nutrition Tracker API running'));

// File upload
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ filename: req.file.filename, path: `/uploads/${req.file.filename}` });
});

// Static Files
app.use('/pages', express.static(pagesDir));
app.use(express.static(frontendDir));
app.use('/uploads', express.static(uploadDir));

app.get('/login', (req, res) => {
  res.sendFile(path.join(pagesDir, 'login.html'));
});

// Start Server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/NutritionTracker", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

startServer();
