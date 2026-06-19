const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { isConnected } = require('../config/db');

const normalizeUsername = (value) => value?.trim().toLowerCase();

const login = async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({ message: 'Database unavailable' });
    }

    const { username, password } = req.body;
    const normalizedUsername = normalizeUsername(username);

    const admin = await Admin.findOne({
      username: normalizedUsername
    });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || 'sports_meet_secret_key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      admin: {
        id: admin._id.toString(),
        username: admin.username
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const register = async (req, res) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({ message: 'Database unavailable' });
    }

    const { username, password } = req.body;
    const normalizedUsername = normalizeUsername(username);

    const existingAdmin = await Admin.findOne({
      username: normalizedUsername
    });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await Admin.create({
      username: normalizedUsername,
      password: hashedPassword
    });

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login, register };
