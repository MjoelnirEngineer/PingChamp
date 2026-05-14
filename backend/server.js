/**
 * PingChamp Backend API Server
 * 
 * This is a simple Node.js/Express backend that handles ping requests for the PingChamp frontend.
 * 
 * Installation:
 * npm install express cors ping dotenv
 * 
 * Usage:
 * node server.js
 * 
 * The server will run on http://localhost:3001 by default
 */

const express = require('express');
const cors = require('cors');
const ping = require('ping');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';

// Enable CORS for the frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  methods: ['GET', 'POST'],
  credentials: true,
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main ping endpoint
app.get('/api/ping', async (req, res) => {
  const { host } = req.query;

  // Validation
  if (!host) {
    return res.status(400).json({
      success: false,
      error: 'Missing required parameter: host',
    });
  }

  // Security: Validate host format to prevent injection attacks
  const isValidHost = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$|^(\d{1,3}\.){3}\d{1,3}$/.test(host);
  
  if (!isValidHost) {
    return res.status(400).json({
      success: false,
      error: 'Invalid host format',
    });
  }

  try {
    // Perform the ping with a 5 second timeout
    const result = await ping.promise.probe(host, {
      timeout: 5,
      extra: ['-n'], // Use 1 ping attempt only
    });

    const responseTime = result.time ? Math.round(result.time * 1000) / 1000 : null;

    res.json({
      success: result.alive,
      responseTime: responseTime,
      host: host,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Ping error for host ${host}:`, error.message);
    
    res.json({
      success: false,
      host: host,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`🚀 PingChamp Backend API running on http://${HOST}:${PORT}`);
  console.log(`📊 Ping endpoint: GET /api/ping?host=<hostname>`);
  console.log(`❤️  Health check: GET /health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️  Shutting down gracefully...');
  process.exit(0);
});
