const { mockBrokerClient } = require('../utils/apiClient');
const logger = require('../utils/logger');

// Mock portfolio data (in a real app this would be in a database)
let mockPortfolio = {
  cash: 100000,
  positions: [],
  transactions: []
};

/**
 * Get current portfolio
 * @returns {Object} Current portfolio
 */
const getPortfolio = () => {
  // Calculate total value
  const positionsValue = mockPortfolio.positions.reduce((total, position) => {
    return total + (position.quantity * position.currentPrice);
  }, 0);
  
  return {
    ...mockPortfolio,
    totalValue: mockPortfolio.cash + positionsValue,
    timestamp: new Date().toISOString()
  };
};

/**
 * Execute a trade order
 * @param {Object} order - Order details
 * @returns {Object} Order result
 */
const executeOrder = async (order) => {
  try {
    const { symbol, type, quantity, price, action } = order;
    
    logger.info(`Executing ${action} order for ${quantity} shares of ${symbol}`);
    
    // In a real implementation, we would call the broker API
    // For now, we'll simulate the order execution
    
    // Simple validation
    if (!symbol || !type || !quantity || !action) {
      throw new Error('Missing required order parameters');
    }
    
    if (!['market', 'limit'].includes(type)) {
      throw new Error('Invalid order type, must be "market" or "limit"');
    }
    
    if (!['buy', 'sell'].includes(action)) {
      throw new Error('Invalid order action, must be "buy" or "sell"');
    }
    
    // Get current price (in a real app, this would come from a real-time data feed)
    const currentPrice = price || (100 + Math.random() * 50);
    
    // For limit orders, check if the price condition is met
    if (type === 'limit') {
      if (action === 'buy' && currentPrice > price) {
        return {
          status: 'pending',
          message: `Limit buy order for ${symbol} waiting for price ${price}, current price is ${currentPrice.toFixed(2)}`,
          order
        };
      }
      
      if (action === 'sell' && currentPrice < price) {
        return {
          status: 'pending',
          message: `Limit sell order for ${symbol} waiting for price ${price}, current price is ${currentPrice.toFixed(2)}`,
          order
        };
      }
    }
    
    // Calculate order value
    const orderValue = quantity * currentPrice;
    
    // Check if selling more than we own
    if (action === 'sell') {
      const position = mockPortfolio.positions.find(p => p.symbol === symbol);
      
      if (!position || position.quantity < quantity) {
        throw new Error(`Cannot sell ${quantity} shares of ${symbol}, you only own ${position ? position.quantity : 0}`);
      }
    }
    
    // Check if enough cash for buy
    if (action === 'buy' && orderValue > mockPortfolio.cash) {
      throw new Error(`Insufficient funds for order. Order value: $${orderValue.toFixed(2)}, available cash: $${mockPortfolio.cash.toFixed(2)}`);
    }
    
    // Execute the order
    const transaction = {
      id: `t-${Date.now()}`,
      symbol,
      action,
      quantity,
      price: currentPrice,
      value: orderValue,
      timestamp: new Date().toISOString()
    };
    
    // Update portfolio
    if (action === 'buy') {
      // Deduct cash
      mockPortfolio.cash -= orderValue;
      
      // Add or update position
      const existingPosition = mockPortfolio.positions.find(p => p.symbol === symbol);
      
      if (existingPosition) {
        // Update existing position
        const newQuantity = existingPosition.quantity + quantity;
        const newCostBasis = ((existingPosition.costBasis * existingPosition.quantity) + orderValue) / newQuantity;
        
        existingPosition.quantity = newQuantity;
        existingPosition.costBasis = newCostBasis;
        existingPosition.currentPrice = currentPrice;
      } else {
        // Add new position
        mockPortfolio.positions.push({
          symbol,
          quantity,
          costBasis: currentPrice,
          currentPrice
        });
      }
    } else {
      // Add cash
      mockPortfolio.cash += orderValue;
      
      // Update position
      const position = mockPortfolio.positions.find(p => p.symbol === symbol);
      position.quantity -= quantity;
      
      // Remove position if quantity is 0
      if (position.quantity === 0) {
        mockPortfolio.positions = mockPortfolio.positions.filter(p => p.symbol !== symbol);
      }
    }
    
    // Record transaction
    mockPortfolio.transactions.push(transaction);
    
    return {
      status: 'executed',
      message: `Successfully ${action === 'buy' ? 'bought' : 'sold'} ${quantity} shares of ${symbol} at $${currentPrice.toFixed(2)}`,
      transaction,
      portfolio: getPortfolio()
    };
  } catch (error) {
    logger.error(`Error executing order: ${error.message}`);
    return {
      status: 'error',
      message: error.message
    };
  }
};

/**
 * Update portfolio with latest prices
 * @returns {Object} Updated portfolio
 */
const updatePortfolio = async () => {
  try {
    logger.info('Updating portfolio with latest prices');
    
    // In a real implementation, we would fetch the latest prices from an API
    // For mock purposes, we'll simulate price changes
    
    // Update position prices with some random changes
    mockPortfolio.positions.forEach(position => {
      // Random price change between -2% and 2%
      const priceChange = position.currentPrice * (Math.random() * 0.04 - 0.02);
      position.currentPrice += priceChange;
    });
    
    return getPortfolio();
  } catch (error) {
    logger.error(`Error updating portfolio: ${error.message}`);
    throw new Error(`Failed to update portfolio: ${error.message}`);
  }
};

/**
 * Analyze portfolio performance
 * @param {string} period - Time period for analysis (1d, 1w, 1m, 3m, 1y)
 * @returns {Object} Portfolio performance analysis
 */
const analyzePerformance = async (period = '1m') => {
  try {
    logger.info(`Analyzing portfolio performance for period: ${period}`);
    
    // In a real implementation, we would have historical portfolio values
    // For mock purposes, we'll simulate performance
    
    // Get current portfolio
    const portfolio = getPortfolio();
    
    // Generate mock historical data
    const historicalValues = [];
    const startDate = new Date();
    let dataPoints = 30; // Default to 1 month
    
    // Determine number of data points based on period
    switch (period) {
      case '1d':
        dataPoints = 24; // Hourly for 1 day
        break;
      case '1w':
        dataPoints = 7; // Daily for 1 week
        break;
      case '1m':
        dataPoints = 30; // Daily for 1 month
        break;
      case '3m':
        dataPoints = 90; // Daily for 3 months
        break;
      case '1y':
        dataPoints = 365; // Daily for 1 year
        break;
      default:
        dataPoints = 30;
    }
    
    // Start with current value and work backwards
    let value = portfolio.totalValue;
    
    for (let i = 0; i < dataPoints; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() - i);
      
      // Random daily change between -1% and 1.5% (slight upward bias)
      const dailyChange = value * (Math.random() * 0.025 - 0.01);
      value -= dailyChange;
      
      historicalValues.unshift({
        date: date.toISOString().split('T')[0],
        value
      });
    }
    
    // Calculate performance metrics
    const startValue = historicalValues[0].value;
    const endValue = portfolio.totalValue;
    const absoluteReturn = endValue - startValue;
    const percentReturn = (absoluteReturn / startValue) * 100;
    
    // Calculate annualized return
    let annualizedReturn = 0;
    switch (period) {
      case '1d':
        annualizedReturn = Math.pow(1 + (percentReturn / 100), 365) - 1;
        break;
      case '1w':
        annualizedReturn = Math.pow(1 + (percentReturn / 100), 52) - 1;
        break;
      case '1m':
        annualizedReturn = Math.pow(1 + (percentReturn / 100), 12) - 1;
        break;
      case '3m':
        annualizedReturn = Math.pow(1 + (percentReturn / 100), 4) - 1;
        break;
      case '1y':
        annualizedReturn = percentReturn / 100;
        break;
    }
    annualizedReturn *= 100;
    
    // Calculate volatility (standard deviation of returns)
    const returns = [];
    for (let i = 1; i < historicalValues.length; i++) {
      const dailyReturn = (historicalValues[i].value / historicalValues[i - 1].value) - 1;
      returns.push(dailyReturn);
    }
    
    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const squaredDiffs = returns.map(ret => Math.pow(ret - avgReturn, 2));
    const variance = squaredDiffs.reduce((sum, sqDiff) => sum + sqDiff, 0) / returns.length;
    const volatility = Math.sqrt(variance) * 100;
    
    return {
      period,
      currentValue: endValue,
      startValue,
      absoluteReturn,
      percentReturn,
      annualizedReturn,
      volatility,
      historicalValues,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error(`Error analyzing performance: ${error.message}`);
    throw new Error(`Failed to analyze performance: ${error.message}`);
  }
};

/**
 * Reset the mock portfolio (for testing)
 */
const resetPortfolio = () => {
  mockPortfolio = {
    cash: 100000,
    positions: [],
    transactions: []
  };
  
  return getPortfolio();
};

module.exports = {
  getPortfolio,
  executeOrder,
  updatePortfolio,
  analyzePerformance,
  resetPortfolio
}; 