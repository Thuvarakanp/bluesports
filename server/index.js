const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, isConnected } = require('./config/db');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const resultRoutes = require('./routes/resultRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const DEFAULT_ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase();
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Sathu1234';

// Middleware
// Restrict CORS to the deployed frontend when CLIENT_URL is set (comma-separated
// list allowed); otherwise allow all origins (handy for local dev).
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((origin) => origin.trim())
  : null;
app.use(cors(allowedOrigins ? { origin: allowedOrigins } : {}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/results', resultRoutes);

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const seedDefaultAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);

    await Admin.updateOne(
      { username: DEFAULT_ADMIN_USERNAME },
      {
        $set: {
          username: DEFAULT_ADMIN_USERNAME,
          password: hashedPassword
        }
      },
      { upsert: true }
    );

    console.log(`Default admin ready for username: ${DEFAULT_ADMIN_USERNAME}`);
  } catch (error) {
    console.error('Error seeding default admin:', error);
  }
};

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Sports Meet API is running' });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: isConnected() ? 'ok' : 'db-unavailable'
  });
});

connectDB().then(async () => {
  await seedDefaultAdmin();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
