const { technicalindicators } = require('technicalindicators');
const logger = require('./logger');

/**
 * Calculate Simple Moving Average (SMA)
 * @param {Array} prices - Array of price points
 * @param {number} period - Period for SMA calculation
 * @returns {Array} Array of SMA values
 */
const calculateSMA = (prices, period) => {
  if (prices.length < period) {
    logger.warn(`Not enough data points for SMA calculation. Need ${period}, got ${prices.length}.`);
    return [];
  }

  const smaValues = [];
  for (let i = period - 1; i < prices.length; i++) {
    const sma = prices.slice(i - period + 1, i + 1).reduce((sum, price) => sum + price, 0) / period;
    smaValues.push(sma);
  }
  return smaValues;
};

/**
 * Calculate Exponential Moving Average (EMA)
 * @param {Array} prices - Array of price points
 * @param {number} period - Period for EMA calculation
 * @returns {Array} Array of EMA values
 */
const calculateEMA = (prices, period) => {
  if (prices.length < period) {
    logger.warn(`Not enough data points for EMA calculation. Need ${period}, got ${prices.length}.`);
    return [];
  }

  const multiplier = 2 / (period + 1);
  const emaValues = [prices.slice(0, period).reduce((sum, price) => sum + price, 0) / period];
  
  for (let i = period; i < prices.length; i++) {
    const ema = (prices[i] - emaValues[emaValues.length - 1]) * multiplier + emaValues[emaValues.length - 1];
    emaValues.push(ema);
  }
  
  return emaValues;
};

/**
 * Calculate Relative Strength Index (RSI)
 * @param {Array} prices - Array of price points
 * @param {number} period - Period for RSI calculation (typically 14)
 * @returns {Array} Array of RSI values
 */
const calculateRSI = (prices, period = 14) => {
  if (prices.length <= period) {
    logger.warn(`Not enough data points for RSI calculation. Need more than ${period}, got ${prices.length}.`);
    return [];
  }

  const changes = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }

  const rsiValues = [];
  let avgGain = 0;
  let avgLoss = 0;

  // First RSI value
  for (let i = 0; i < period; i++) {
    if (changes[i] > 0) avgGain += changes[i];
    if (changes[i] < 0) avgLoss += Math.abs(changes[i]);
  }

  avgGain /= period;
  avgLoss /= period;

  // Calculate RSI using Wilder's smoothing method
  for (let i = period; i < changes.length; i++) {
    avgGain = ((avgGain * (period - 1)) + (changes[i] > 0 ? changes[i] : 0)) / period;
    avgLoss = ((avgLoss * (period - 1)) + (changes[i] < 0 ? Math.abs(changes[i]) : 0)) / period;
    
    const rs = avgGain / (avgLoss === 0 ? 0.00001 : avgLoss); // Avoid division by zero
    const rsi = 100 - (100 / (1 + rs));
    rsiValues.push(rsi);
  }

  return rsiValues;
};

/**
 * Analyze stock performance and provide recommendations
 * @param {Object} stockData - Historical stock data
 * @returns {Object} Analysis and recommendations
 */
const analyzeStockPerformance = (stockData) => {
  try {
    const { symbol, prices, volumes, dates } = stockData;
    
    // Check if we have enough data
    if (!prices || prices.length < 50) {
      return {
        symbol,
        status: 'insufficient_data',
        message: 'Not enough historical data for analysis'
      };
    }
    
    // Calculate technical indicators
    const sma20 = calculateSMA(prices, 20);
    const sma50 = calculateSMA(prices, 50);
    const ema12 = calculateEMA(prices, 12);
    const ema26 = calculateEMA(prices, 26);
    const rsi = calculateRSI(prices, 14);
    
    // Current price is the last price in the array
    const currentPrice = prices[prices.length - 1];
    const currentSMA20 = sma20[sma20.length - 1];
    const currentSMA50 = sma50[sma50.length - 1];
    const currentEMA12 = ema12[ema12.length - 1];
    const currentEMA26 = ema26[ema26.length - 1];
    const currentRSI = rsi[rsi.length - 1];
    
    // Determine trend
    const trend = currentSMA20 > currentSMA50 ? 'uptrend' : 'downtrend';
    
    // MACD signal
    const macdSignal = currentEMA12 > currentEMA26 ? 'bullish' : 'bearish';
    
    // RSI signal
    let rsiSignal = 'neutral';
    if (currentRSI > 70) rsiSignal = 'overbought';
    else if (currentRSI < 30) rsiSignal = 'oversold';
    
    // Generate recommendation
    let recommendation = 'hold';
    let confidence = 0.5;
    let reasonList = [];
    
    // Moving Average signals
    if (currentPrice > currentSMA20 && currentSMA20 > currentSMA50) {
      recommendation = 'buy';
      confidence += 0.15;
      reasonList.push('Price above both 20-day and 50-day moving averages');
    } else if (currentPrice < currentSMA20 && currentSMA20 < currentSMA50) {
      recommendation = 'sell';
      confidence += 0.15;
      reasonList.push('Price below both 20-day and 50-day moving averages');
    }
    
    // MACD signals
    if (macdSignal === 'bullish') {
      if (recommendation === 'buy') {
        confidence += 0.1;
      } else if (recommendation === 'sell') {
        confidence -= 0.05;
      } else {
        recommendation = 'buy';
        confidence += 0.05;
      }
      reasonList.push('MACD indicates bullish momentum');
    } else {
      if (recommendation === 'sell') {
        confidence += 0.1;
      } else if (recommendation === 'buy') {
        confidence -= 0.05;
      } else {
        recommendation = 'sell';
        confidence += 0.05;
      }
      reasonList.push('MACD indicates bearish momentum');
    }
    
    // RSI signals
    if (rsiSignal === 'overbought') {
      if (recommendation === 'sell') {
        confidence += 0.15;
      } else if (recommendation === 'buy') {
        confidence -= 0.1;
        reasonList.push('RSI indicates overbought conditions, contradicting buy signal');
      } else {
        recommendation = 'sell';
        confidence += 0.1;
      }
      reasonList.push('RSI indicates overbought conditions');
    } else if (rsiSignal === 'oversold') {
      if (recommendation === 'buy') {
        confidence += 0.15;
      } else if (recommendation === 'sell') {
        confidence -= 0.1;
        reasonList.push('RSI indicates oversold conditions, contradicting sell signal');
      } else {
        recommendation = 'buy';
        confidence += 0.1;
      }
      reasonList.push('RSI indicates oversold conditions');
    }
    
    // Cap confidence at 0.95
    confidence = Math.min(confidence, 0.95);
    confidence = Math.max(confidence, 0.05);
    
    return {
      symbol,
      status: 'success',
      currentPrice,
      analysis: {
        trend,
        indicators: {
          sma20: currentSMA20,
          sma50: currentSMA50,
          macd: {
            ema12: currentEMA12,
            ema26: currentEMA26,
            signal: macdSignal
          },
          rsi: {
            value: currentRSI,
            signal: rsiSignal
          }
        }
      },
      recommendation: {
        action: recommendation,
        confidence: confidence.toFixed(2),
        reasons: reasonList
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error(`Error analyzing stock performance: ${error.message}`);
    return {
      symbol: stockData.symbol,
      status: 'error',
      message: 'Failed to analyze stock performance',
      error: error.message
    };
  }
};

module.exports = {
  calculateSMA,
  calculateEMA,
  calculateRSI,
  analyzeStockPerformance
}; 