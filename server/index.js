// Local development entry point. On Vercel the app is served via /api/index.js
// (serverless), so this file is only used when running `npm start` / `npm run dev`.
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB()
  .catch((error) => console.error('Initial DB connection failed:', error.message))
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
