// Vercel Serverless Function entry point for all /api/* routes
// dotenv is loaded inside backend/server.js with __dirname, so we just import the app.
const app = require('../backend/server');
module.exports = app;
