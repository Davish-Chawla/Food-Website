const mongoose = require('mongoose');

// Cache connection across serverless invocations
let cachedConn = null;

const connectDB = async () => {
  // Already fully connected
  if (cachedConn && mongoose.connection.readyState === 1) {
    return cachedConn;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds to find a server
      socketTimeoutMS: 45000,           // 45 seconds for operations
    });
    cachedConn = conn;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    cachedConn = null;
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
