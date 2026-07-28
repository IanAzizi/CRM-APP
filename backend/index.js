require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// CORS Options
const corsOptions = {
  origin: ['http://office.bandarabbasmall.com:3000', 'http://localhost:3000'],
  credentials: true,
};

// اعمال CORS برای همه درخواست‌ها
app.use(cors(corsOptions));

// فقط در صورتی که نیاز به کنترل دستی preflight دارید، این خط را نگه دارید
// (در بیشتر موارد با app.use(cors()) کافی است → نیازی به app.options نیست)
app.options("/{*path}", cors(corsOptions));   // ← اصلاح مهم همینجاست

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API routes
const registerUnitRoutes = require('./routes/registerUnit');
app.use('/api/register-unit', registerUnitRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const checklistRoutes = require('./routes/checklist');
app.use('/api/checklist', checklistRoutes);

const storeVisitRoutes = require('./routes/storeVisit');
app.use('/api/storeVisit', storeVisitRoutes);

const customerVisitRoutes = require('./routes/CustomerVisit');
app.use('/api/customerVisit', customerVisitRoutes);

// Serve static files (React/Vite build)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all برای SPA (باید آخرین باشد)
app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// اگر می‌خوای تست کنی که سرور بالا آمده
app.get('/', (req, res) => {
  res.send('Security App Backend Running');
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// تنظیمات mongoose
mongoose.set('strictPopulate', false);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');

    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server is running on http://${HOST}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// Global error handler (آخرین middleware)
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});