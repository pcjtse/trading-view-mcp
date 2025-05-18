const express = require('express');
const tradingService = require('../services/tradingService');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route GET /api/trading/portfolio
 * @description Get current portfolio
 * @returns {Object} Current portfolio
 */
router.get('/portfolio', (req, res) => {
  try {
    logger.info('Received request for portfolio');
    
    const portfolio = tradingService.getPortfolio();
    
    res.json(portfolio);
  } catch (error) {
    logger.error(`Error in portfolio endpoint: ${error.message}`);
    res.status(500).json({
      error: 'Failed to get portfolio',
      message: error.message
    });
  }
});

/**
 * @route POST /api/trading/order
 * @description Execute a trade order
 * @param {Object} order - Order details
 * @returns {Object} Order result
 */
router.post('/order', async (req, res) => {
  try {
    const order = req.body;
    
    logger.info(`Received ${order.action} order for ${order.quantity} shares of ${order.symbol}`);
    
    // Validate required fields
    if (!order.symbol || !order.action || !order.quantity || !order.type) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'symbol, action, quantity, and type are required fields'
      });
    }
    
    // Validate action
    if (!['buy', 'sell'].includes(order.action)) {
      return res.status(400).json({
        error: 'Invalid action',
        message: 'Action must be either "buy" or "sell"'
      });
    }
    
    // Validate order type
    if (!['market', 'limit'].includes(order.type)) {
      return res.status(400).json({
        error: 'Invalid order type',
        message: 'Type must be either "market" or "limit"'
      });
    }
    
    // Validate quantity
    if (isNaN(order.quantity) || order.quantity <= 0) {
      return res.status(400).json({
        error: 'Invalid quantity',
        message: 'Quantity must be a positive number'
      });
    }
    
    // For limit orders, validate price
    if (order.type === 'limit') {
      if (!order.price || isNaN(order.price) || order.price <= 0) {
        return res.status(400).json({
          error: 'Invalid price for limit order',
          message: 'Price must be a positive number for limit orders'
        });
      }
    }
    
    const result = await tradingService.executeOrder(order);
    
    if (result.status === 'error') {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    logger.error(`Error in order endpoint: ${error.message}`);
    res.status(500).json({
      error: 'Failed to execute order',
      message: error.message
    });
  }
});

/**
 * @route GET /api/trading/performance
 * @description Get portfolio performance analysis
 * @param {string} period - Optional time period for analysis (default: 1m)
 * @returns {Object} Portfolio performance analysis
 */
router.get('/performance', async (req, res) => {
  try {
    const { period = '1m' } = req.query;
    
    logger.info(`Received request for portfolio performance, period: ${period}`);
    
    const performance = await tradingService.analyzePerformance(period);
    
    res.json(performance);
  } catch (error) {
    logger.error(`Error in performance endpoint: ${error.message}`);
    res.status(500).json({
      error: 'Failed to analyze performance',
      message: error.message
    });
  }
});

/**
 * @route PUT /api/trading/portfolio/update
 * @description Update portfolio with latest prices
 * @returns {Object} Updated portfolio
 */
router.put('/portfolio/update', async (req, res) => {
  try {
    logger.info('Received request to update portfolio prices');
    
    const updatedPortfolio = await tradingService.updatePortfolio();
    
    res.json(updatedPortfolio);
  } catch (error) {
    logger.error(`Error in update portfolio endpoint: ${error.message}`);
    res.status(500).json({
      error: 'Failed to update portfolio',
      message: error.message
    });
  }
});

/**
 * @route POST /api/trading/portfolio/reset
 * @description Reset the mock portfolio (for testing)
 * @returns {Object} Reset portfolio
 */
router.post('/portfolio/reset', (req, res) => {
  try {
    logger.info('Received request to reset portfolio');
    
    const resetPortfolio = tradingService.resetPortfolio();
    
    res.json({
      status: 'success',
      message: 'Portfolio has been reset',
      portfolio: resetPortfolio
    });
  } catch (error) {
    logger.error(`Error in reset portfolio endpoint: ${error.message}`);
    res.status(500).json({
      error: 'Failed to reset portfolio',
      message: error.message
    });
  }
});

module.exports = router; 