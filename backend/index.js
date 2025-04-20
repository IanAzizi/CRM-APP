// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// تست اصلی که بررسی می‌کند که سرور در حال اجراست
app.get('/', (req, res) => {
  res.send('Security App Backend Running');
});

// اتصال به MongoDB (بدون گزینه‌های deprecated)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    // راه‌اندازی سرور
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// استفاده از مسیرها
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const checklistRoutes = require('./routes/checklist');
app.use('/api/checklist', checklistRoutes);

const storeVisitRoutes = require('./routes/storeVisit');
app.use('/api/storeVisit', storeVisitRoutes);

// اضافه کردن مسیر برای CustomerVisit
const customerVisitRoutes = require('./routes/CustomerVisit');
app.use('/api/customerVisit', customerVisitRoutes);

// تنظیمات MongoDB
mongoose.set('strictPopulate', false);
