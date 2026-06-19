const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { isConnected } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const resultRoutes = require('./routes/resultRoutes');

const app = express();

// When the frontend is served from the same Vercel project, requests are
// same-origin and CORS is not needed. CLIENT_URL can still restrict origins
// if the API is ever hosted separately; unset = allow all.
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((origin) => origin.trim())
  : null;
app.use(cors(allowedOrigins ? { origin: allowedOrigins } : {}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/results', resultRoutes);

// Local-disk uploads (used only by the dev fallback; production uses Cloudinary).
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health checks
app.get('/', (_req, res) => {
  res.json({ message: 'Sports Meet API is running' });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: isConnected() ? 'ok' : 'db-unavailable' });
});

module.exports = app;
