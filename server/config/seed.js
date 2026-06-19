const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

// Ensures the default admin account exists (idempotent upsert).
const seedDefaultAdmin = async () => {
  const username = (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Sathu1234';
  const hashedPassword = await bcrypt.hash(password, 10);

  await Admin.updateOne(
    { username },
    { $set: { username, password: hashedPassword } },
    { upsert: true }
  );

  console.log(`Default admin ready for username: ${username}`);
};

module.exports = seedDefaultAdmin;
