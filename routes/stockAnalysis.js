const express = require('express');
const stockAnalysisService = require('../services/stockAnalysisService');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route GET /api/analysis/stock/:symbol
 * @description Get stock analysis and recommendation
 * @param {string} symbol - Stock symbol
 * @param {string} timeframe - Optional timeframe (default: 1d)
 * @returns {Object} Stock analysis and recommendation
 */
router.get('/stock/:symbol', async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const { timeframe = '1d' } = req.query;
    
    logger.info(`Received request for stock analysis: ${symbol}, timeframe: ${timeframe}`);
    
    const analysis = await stockAnalysisService.getStockAnalysis(symbol, timeframe);
    
    res.json(analysis);
  } catch (error) {
    logger.error(`Error in stock analysis endpoint: ${error.message}`);
    next(error);
  }
});

/**
 * @route POST /api/analysis/batch
 * @description Analyze multiple stocks in batch
 * @param {Array} symbols - Array of stock symbols
 * @param {string} timeframe - Optional timeframe (default: 1d)
 * @returns {Array} Array of stock analyses
 */
router.post('/batch', async (req, res, next) => {
  try {
    const { symbols, timeframe = '1d' } = req.body;
    
    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return res.status(400).json({
        error: 'Please provide an array of stock symbols'
      });
    }
    
    logger.info(`Received request for batch analysis of ${symbols.length} stocks`);
    
    const analyses = await stockAnalysisService.batchAnalyzeStocks(symbols, timeframe);
    
    res.json(analyses);
  } catch (error) {
    logger.error(`Error in batch analysis endpoint: ${error.message}`);
    next(error);
  }
});

/**
 * @route GET /api/analysis/tradingview/:symbol
 * @description Get TradingView indicators for a stock
 * @param {string} symbol - Stock symbol
 * @returns {Object} TradingView indicators
 */
router.get('/tradingview/:symbol', async (req, res, next) => {
  try {
    const { symbol } = req.params;
    
    logger.info(`Received request for TradingView indicators: ${symbol}`);
    
    const indicators = await stockAnalysisService.getTradingViewIndicators(symbol);
    
    res.json(indicators);
  } catch (error) {
    logger.error(`Error in TradingView indicators endpoint: ${error.message}`);
    next(error);
  }
});

/**
 * @route GET /api/analysis/historical/:symbol
 * @description Get historical data for a stock
 * @param {string} symbol - Stock symbol
 * @param {string} timeframe - Optional timeframe (default: 1d)
 * @param {number} limit - Optional limit of data points (default: 100)
 * @returns {Object} Historical stock data
 */
router.get('/historical/:symbol', async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const { timeframe = '1d', limit = 100 } = req.query;
    
    logger.info(`Received request for historical data: ${symbol}, timeframe: ${timeframe}, limit: ${limit}`);
    
    const historicalData = await stockAnalysisService.fetchHistoricalData(symbol, timeframe, parseInt(limit, 10));
    
    res.json(historicalData);
  } catch (error) {
    logger.error(`Error in historical data endpoint: ${error.message}`);
    next(error);
  }
});

module.exports = router; 