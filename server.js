const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const winston = require('winston');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Set up middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Import routes
const stockAnalysisRoutes = require('./routes/stockAnalysis');
const tradingRoutes = require('./routes/trading');
const marketResearchRoutes = require('./routes/marketResearch');
const mcpRoutes = require('./routes/mcp');

// Mount routes
app.use('/api/analysis', stockAnalysisRoutes);
app.use('/api/trading', tradingRoutes);
app.use('/api/research', marketResearchRoutes);
app.use('/api/mcp', mcpRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'MCP server is running' });
});

// MCP Info endpoint
app.get('/mcp-info', (req, res) => {
  res.status(200).json({
    provider: process.env.MCP_PROVIDER_NAME || 'tradingview-mcp',
    version: process.env.MCP_VERSION || '1.0',
    status: 'active',
    capabilities_endpoint: '/api/mcp/capabilities',
    context_endpoint: '/api/mcp/context'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error'
    }
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
  
  // Log MCP status
  if (process.env.MCP_ENABLED === 'true') {
    logger.info('Model Context Protocol (MCP) integration is enabled');
    console.log('Model Context Protocol (MCP) integration is enabled');
  }
});

module.exports = app; 