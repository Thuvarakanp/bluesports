const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const isConnected = () => mongoose.connection.readyState === 1;
const defaultDbName = process.env.MONGODB_DB_NAME || 'sports_meet';

const connectionOptions = {
  dbName: defaultDbName,
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000
};

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI;
  const fallbackUri = process.env.MONGODB_LOCAL_URI || 'mongodb://127.0.0.1:27017/sports_meet';

  try {
    if (primaryUri) {
      await mongoose.connect(primaryUri, connectionOptions);
      console.log('MongoDB connected successfully using Atlas URI');
      return true;
    }

    await mongoose.connect(fallbackUri, connectionOptions);
    console.log('MongoDB connected successfully using local fallback URI');
    return true;
  } catch (error) {
    console.error('Primary MongoDB connection failed:', error.message);

    try {
      await mongoose.connect(fallbackUri, connectionOptions);
      console.log('MongoDB connected successfully using local fallback URI');
      return true;
    } catch (fallbackError) {
      console.error('Fallback MongoDB connection failed:', fallbackError.message);
      return false;
    }
  }
};

module.exports = { connectDB, isConnected };
