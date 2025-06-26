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

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API routes
const registerUnitRoutes = require('./routes/registerUnit');
app.use('/api/register-unit', registerUnitRoutes);

// Other API routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const checklistRoutes = require('./routes/checklist');
app.use('/api/checklist', checklistRoutes);
const storeVisitRoutes = require('./routes/storeVisit');
app.use('/api/storeVisit', storeVisitRoutes);
const customerVisitRoutes = require('./routes/CustomerVisit');
app.use('/api/customerVisit', customerVisitRoutes);

// Serve static files (e.g., React build) AFTER API routes
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Catch-all for React app (single-page app routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Default to localhost
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ Connected to MongoDB');

    // Start server
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server is running on http://${HOST}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// Test route
app.get('/', (req, res) => {
  res.send('Security App Backend Running');
});

// MongoDB settings
mongoose.set('strictPopulate', false);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});