const dns = require('dns');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const seedDefaultAdmin = require('./seed');

dotenv.config();

// Custom DNS only helps some local networks resolve the Atlas SRV record.
// Skip it on Vercel, where the platform resolver already works.
if (!process.env.VERCEL) {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (_) {
    /* ignore */
  }
}

const isConnected = () => mongoose.connection.readyState === 1;

const connectionOptions = {
  dbName: process.env.MONGODB_DB_NAME || 'sports_meet',
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000
};

// Cache the connection across serverless invocations so each request reuses the
// same MongoDB connection instead of opening a new one on every cold start.
let cached = global.__mongooseConn;
if (!cached) cached = global.__mongooseConn = { promise: null };

const connectDB = async () => {
  if (isConnected()) return mongoose.connection;

  if (!cached.promise) {
    const uri =
      process.env.MONGODB_URI ||
      process.env.MONGODB_LOCAL_URI ||
      'mongodb://127.0.0.1:27017/sports_meet';

    cached.promise = mongoose
      .connect(uri, connectionOptions)
      .then(async (mongooseInstance) => {
        console.log('MongoDB connected successfully');
        try {
          await seedDefaultAdmin();
        } catch (seedError) {
          console.error('Error seeding default admin:', seedError.message);
        }
        return mongooseInstance;
      })
      .catch((error) => {
        cached.promise = null; // allow a retry on the next request
        console.error('MongoDB connection failed:', error.message);
        throw error;
      });
  }

  await cached.promise;
  return mongoose.connection;
};

module.exports = { connectDB, isConnected };
