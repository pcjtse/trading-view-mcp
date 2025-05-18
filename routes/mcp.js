const express = require('express');
const { processMcpRequest, getMcpHeaders } = require('../utils/mcpIntegration');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route POST /api/mcp/context
 * @description Process MCP request and return context
 * @param {Object} request - MCP request object
 * @returns {Object} MCP context response
 */
router.post('/context', async (req, res) => {
  try {
    logger.info('Received MCP context request');
    
    // Validate request format
    if (!req.body || !req.body.type) {
      return res.status(400).json({
        status: 'error',
        error: 'Invalid MCP request format. Request must include type field.'
      });
    }
    
    // Process the MCP request
    const response = await processMcpRequest(req.body);
    
    // Add MCP headers
    const mcpHeaders = getMcpHeaders();
    Object.entries(mcpHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    
    // Return response
    res.json(response);
  } catch (error) {
    logger.error(`Error in MCP context endpoint: ${error.message}`);
    res.status(500).json({
      status: 'error',
      error: 'Internal server error processing MCP request'
    });
  }
});

/**
 * @route GET /api/mcp/capabilities
 * @description Get MCP provider capabilities
 * @returns {Object} Provider capabilities
 */
router.get('/capabilities', (req, res) => {
  try {
    logger.info('Received MCP capabilities request');
    
    // Add MCP headers
    const mcpHeaders = getMcpHeaders();
    Object.entries(mcpHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    
    // Return capabilities
    res.json({
      status: 'success',
      provider: 'tradingview-mcp',
      version: '1.0',
      capabilities: [
        {
          type: 'stock_analysis',
          description: 'Analyze stock performance and provide recommendations',
          parameters: {
            symbol: { type: 'string', required: true, description: 'Stock symbol' },
            timeframe: { type: 'string', required: false, description: 'Analysis timeframe (1d, 1w, 1m)', default: '1d' }
          }
        },
        {
          type: 'portfolio',
          description: 'View and manage portfolio',
          parameters: {
            action: { type: 'string', required: false, description: 'Portfolio action (view, performance, update)', default: 'view' },
            period: { type: 'string', required: false, description: 'Time period for performance analysis (1d, 1w, 1m, 3m, 1y)', default: '1m' }
          }
        },
        {
          type: 'trade_execution',
          description: 'Execute trade orders',
          parameters: {
            symbol: { type: 'string', required: true, description: 'Stock symbol' },
            action: { type: 'string', required: true, description: 'Trade action (buy, sell)' },
            quantity: { type: 'number', required: true, description: 'Number of shares' },
            type: { type: 'string', required: false, description: 'Order type (market, limit)', default: 'market' },
            price: { type: 'number', required: false, description: 'Limit price (required for limit orders)' }
          }
        },
        {
          type: 'market_research',
          description: 'Perform market research',
          parameters: {
            type: { type: 'string', required: false, description: 'Research type (news, sectors, economic, diversification)', default: 'news' },
            symbols: { type: 'array', required: false, description: 'Stock symbols for news filtering' },
            limit: { type: 'number', required: false, description: 'Maximum number of news items', default: 10 }
          }
        }
      ]
    });
  } catch (error) {
    logger.error(`Error in MCP capabilities endpoint: ${error.message}`);
    res.status(500).json({
      status: 'error',
      error: 'Internal server error'
    });
  }
});

module.exports = router; 