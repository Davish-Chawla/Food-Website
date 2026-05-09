const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

// Load env vars — use __dirname so this works whether called directly or via api/index.js
dotenv.config({ path: path.resolve(__dirname, '.env') });


const app = express();

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Enable CORS
app.use(cors());

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database connection error', error: error.message });
  }
});

// Root route for health check
app.get(['/', '/api'], async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    const readyStateMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    res.json({ 
      success: true,
      message: 'Foodie API is running...', 
      database: dbStatus,
      readyState: readyStateMap[mongoose.connection.readyState] || 'unknown',
      env: {
        has_mongo_uri: !!process.env.MONGO_URI,
        mongo_uri_prefix: process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 30) + '...' : 'NOT SET',
        node_env: process.env.NODE_ENV
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Route files
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

// Mount routers
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/menu', '/menu'], menuRoutes);
app.use(['/api/orders', '/orders'], orderRoutes);
app.use(['/api/admin', '/admin'], adminRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;

// Only listen if not running on Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
