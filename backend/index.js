require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// CORS Options برای تست
const corsOptions = {
  origin: 'http://office.bandarabbasmall.com:3000',
  credentials: true
};
  
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

// مقدار پیش‌فرض localhost
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // به‌صورت دستی مقدار دهی شد تا همیشه روی لوکال اجرا بشه

// اتصال به MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Connected to MongoDB");

    // راه‌اندازی سرور
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
    
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// تست ساده
app.get('/', (req, res) => {
  res.send('Security App Backend Running');
});

// مسیرها
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const checklistRoutes = require('./routes/checklist');
app.use('/api/checklist', checklistRoutes);

const storeVisitRoutes = require('./routes/storeVisit'); // بدون اسلش آخر
app.use('/api/storeVisit', storeVisitRoutes);

const customerVisitRoutes = require('./routes/CustomerVisit');
app.use('/api/customerVisit', customerVisitRoutes);

// تنظیمات MongoDB
mongoose.set('strictPopulate', false);
