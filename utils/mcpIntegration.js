/**
 * Model Context Protocol (MCP) Integration Module
 * 
 * This module provides integration with the Model Context Protocol standard,
 * allowing the trading platform to be used as a context provider for LLMs.
 */

const logger = require('./logger');
const stockAnalysisService = require('../services/stockAnalysisService');
const tradingService = require('../services/tradingService');
const marketResearchService = require('../services/marketResearchService');

/**
 * Processes an MCP request and generates the appropriate context
 * @param {Object} mcpRequest - The request from the MCP client
 * @returns {Object} - Response with context data
 */
async function processMcpRequest(mcpRequest) {
  try {
    logger.info('Processing MCP request', { requestType: mcpRequest.type });
    
    const { type, parameters } = mcpRequest;
    
    switch (type) {
      case 'stock_analysis':
        return await handleStockAnalysis(parameters);
      
      case 'portfolio':
        return await handlePortfolio(parameters);
      
      case 'trade_execution':
        return await handleTradeExecution(parameters);
      
      case 'market_research':
        return await handleMarketResearch(parameters);
      
      default:
        return {
          status: 'error',
          error: 'Unsupported request type',
          supportedTypes: ['stock_analysis', 'portfolio', 'trade_execution', 'market_research']
        };
    }
  } catch (error) {
    logger.error('Error processing MCP request', { error: error.message });
    return {
      status: 'error',
      error: error.message
    };
  }
}

/**
 * Handle stock analysis requests
 * @param {Object} parameters - Analysis parameters
 * @returns {Object} - Analysis results
 */
async function handleStockAnalysis(parameters) {
  const { symbol, timeframe = '1d' } = parameters;
  
  if (!symbol) {
    return {
      status: 'error',
      error: 'Symbol parameter is required'
    };
  }
  
  const analysis = await stockAnalysisService.getStockAnalysis(symbol, timeframe);
  
  return {
    status: 'success',
    type: 'stock_analysis',
    data: analysis
  };
}

/**
 * Handle portfolio requests
 * @param {Object} parameters - Portfolio parameters
 * @returns {Object} - Portfolio data
 */
async function handlePortfolio(parameters) {
  const { action = 'view', period } = parameters;
  
  switch (action) {
    case 'view':
      const portfolio = tradingService.getPortfolio();
      return {
        status: 'success',
        type: 'portfolio',
        data: portfolio
      };
      
    case 'performance':
      const timeframe = period || '1m';
      const performance = await tradingService.analyzePerformance(timeframe);
      return {
        status: 'success',
        type: 'portfolio_performance',
        data: performance
      };
      
    case 'update':
      const updatedPortfolio = await tradingService.updatePortfolio();
      return {
        status: 'success',
        type: 'portfolio_update',
        data: updatedPortfolio
      };
      
    default:
      return {
        status: 'error',
        error: `Unsupported portfolio action: ${action}`,
        supportedActions: ['view', 'performance', 'update']
      };
  }
}

/**
 * Handle trade execution requests
 * @param {Object} parameters - Trade parameters
 * @returns {Object} - Trade execution results
 */
async function handleTradeExecution(parameters) {
  const { symbol, action, quantity, type = 'market', price } = parameters;
  
  // Validate required parameters
  if (!symbol || !action || !quantity) {
    return {
      status: 'error',
      error: 'Missing required parameters. Need symbol, action, and quantity.'
    };
  }
  
  // Validate action
  if (!['buy', 'sell'].includes(action)) {
    return {
      status: 'error',
      error: 'Invalid action. Must be "buy" or "sell".'
    };
  }
  
  // Validate order type
  if (!['market', 'limit'].includes(type)) {
    return {
      status: 'error',
      error: 'Invalid order type. Must be "market" or "limit".'
    };
  }
  
  // Validate quantity
  if (isNaN(quantity) || quantity <= 0) {
    return {
      status: 'error',
      error: 'Quantity must be a positive number.'
    };
  }
  
  // For limit orders, validate price
  if (type === 'limit' && (!price || isNaN(price) || price <= 0)) {
    return {
      status: 'error',
      error: 'Price must be a positive number for limit orders.'
    };
  }
  
  const order = {
    symbol,
    action,
    quantity: parseInt(quantity, 10),
    type,
    price: price ? parseFloat(price) : undefined
  };
  
  const result = await tradingService.executeOrder(order);
  
  return {
    status: result.status === 'error' ? 'error' : 'success',
    type: 'trade_execution',
    data: result
  };
}

/**
 * Handle market research requests
 * @param {Object} parameters - Research parameters
 * @returns {Object} - Research data
 */
async function handleMarketResearch(parameters) {
  const { type = 'news', symbols, limit = 10 } = parameters;
  
  switch (type) {
    case 'news':
      const symbolsArray = symbols ? (Array.isArray(symbols) ? symbols : [symbols]) : [];
      const news = await marketResearchService.getMarketNews(symbolsArray, parseInt(limit, 10));
      return {
        status: 'success',
        type: 'market_news',
        data: news
      };
      
    case 'sectors':
      const sectors = await marketResearchService.getSectorPerformance();
      return {
        status: 'success',
        type: 'sector_performance',
        data: sectors
      };
      
    case 'economic':
      const indicators = await marketResearchService.getEconomicIndicators();
      return {
        status: 'success',
        type: 'economic_indicators',
        data: indicators
      };
      
    case 'diversification':
      const portfolio = tradingService.getPortfolio();
      const diversification = await marketResearchService.analyzePortfolioDiversification(portfolio);
      return {
        status: 'success',
        type: 'portfolio_diversification',
        data: diversification
      };
      
    default:
      return {
        status: 'error',
        error: `Unsupported research type: ${type}`,
        supportedTypes: ['news', 'sectors', 'economic', 'diversification']
      };
  }
}

/**
 * Generates the MCP headers to be included in API responses
 * @returns {Object} - MCP headers
 */
function getMcpHeaders() {
  return {
    'MCP-Version': '1.0',
    'MCP-Provider': 'tradingview-mcp',
    'MCP-Content-Type': 'application/json'
  };
}

module.exports = {
  processMcpRequest,
  getMcpHeaders
}; 