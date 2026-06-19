// Vercel serverless entry point. All /api/* requests are rewritten here (see
// vercel.json) and handled by the Express app. The DB connection is established
// (and cached) before the request is processed.
const app = require('../server/app');
const { connectDB } = require('../server/config/db');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (error) {
    console.error('DB connection error:', error.message);
    // Continue anyway — controllers return 503 when the DB is unavailable.
  }
  return app(req, res);
};
