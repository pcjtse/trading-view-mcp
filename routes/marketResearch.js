const express = require('express');
const marketResearchService = require('../services/marketResearchService');
const tradingService = require('../services/tradingService');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route GET /api/research/news
 * @description Get market news
 * @param {string} symbols - Optional comma-separated list of stock symbols
 * @param {number} limit - Optional maximum number of news items (default: 10)
 * @returns {Array} News articles
 */
router.get('/news', async (req, res) => {
  try {
    const { symbols, limit = 10 } = req.query;
    
    // Parse symbols if provided
    const symbolsArray = symbols ? symbols.split(',') : [];
    
    logger.info(`Received request for market news, symbols: ${symbolsArray.join(', ') || 'none'}, limit: ${limit}`);
    
    const news = await marketResearchService.getMarketNews(symbolsArray, parseInt(limit, 10));
    
    res.json(news);
  } catch (error) {
    logger.error(`Error in market news endpoint: ${error.message}`);
    res.status(500).json({
      error: 'Failed to get market news',
      message: error.message
    });
  }
});

/**
 * @route GET /api/research/sectors
 * @description Get sector performance
 * @returns {Array} Sector performance data
 */
router.get('/sectors', async (req, res) => {
  try {
    logger.info('Received request for sector performance');
    
    const sectorData = await marketResearchService.getSectorPerformance();
    
    res.json(sectorData);
  } catch (error) {
    logger.error(`Error in sector performance endpoint: ${error.message}`);
    res.status(500).json({
      error: 'Failed to get sector performance',
      message: error.message
    });
  }
});

/**
 * @route GET /api/research/economic
 * @description Get economic indicators
 * @returns {Object} Economic indicators
 */
router.get('/economic', async (req, res) => {
  try {
    logger.info('Received request for economic indicators');
    
    const indicators = await marketResearchService.getEconomicIndicators();
    
    res.json(indicators);
  } catch (error) {
    logger.error(`Error in economic indicators endpoint: ${error.message}`);
    res.status(500).json({
      error: 'Failed to get economic indicators',
      message: error.message
    });
  }
});

/**
 * @route GET /api/research/portfolio/diversification
 * @description Analyze portfolio diversification
 * @returns {Object} Portfolio diversification analysis
 */
router.get('/portfolio/diversification', async (req, res) => {
  try {
    logger.info('Received request for portfolio diversification analysis');
    
    // Get current portfolio
    const portfolio = tradingService.getPortfolio();
    
    // Analyze diversification
    const diversificationAnalysis = await marketResearchService.analyzePortfolioDiversification(portfolio);
    
    res.json(diversificationAnalysis);
  } catch (error) {
    logger.error(`Error in portfolio diversification endpoint: ${error.message}`);
    res.status(500).json({
      error: 'Failed to analyze portfolio diversification',
      message: error.message
    });
  }
});

/**
 * @route GET /api/research/portfolio/news
 * @description Get news related to portfolio holdings
 * @param {number} limit - Optional maximum number of news items (default: 10)
 * @returns {Array} News articles related to portfolio
 */
router.get('/portfolio/news', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    logger.info('Received request for portfolio-related news');
    
    // Get current portfolio
    const portfolio = tradingService.getPortfolio();
    
    // Extract symbols from portfolio
    const symbols = portfolio.positions.map(position => position.symbol);
    
    if (symbols.length === 0) {
      return res.json([]);
    }
    
    // Get news for portfolio symbols
    const news = await marketResearchService.getMarketNews(symbols, parseInt(limit, 10));
    
    res.json(news);
  } catch (error) {
    logger.error(`Error in portfolio news endpoint: ${error.message}`);
    res.status(500).json({
      error: 'Failed to get portfolio news',
      message: error.message
    });
  }
});

module.exports = router; 