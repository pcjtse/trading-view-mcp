const axios = require('axios');
const logger = require('./logger');

/**
 * Creates a configured axios instance for API calls
 * @param {string} baseURL - The base URL for the API
 * @param {Object} headers - Headers to include in every request
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Object} Configured axios instance
 */
const createApiClient = (baseURL, headers = {}, timeout = 10000) => {
  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    timeout
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      logger.info(`API Request: ${config.method.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      logger.error(`API Request Error: ${error.message}`);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => {
      logger.info(`API Response: ${response.status} from ${response.config.url}`);
      return response;
    },
    (error) => {
      if (error.response) {
        logger.error(`API Error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
      } else {
        logger.error(`API Error: ${error.message}`);
      }
      return Promise.reject(error);
    }
  );

  return client;
};

// Market data API client
const marketDataClient = createApiClient(
  'https://api.marketdata.com/v1', // Replace with actual market data API
  { 'X-API-KEY': process.env.MARKET_DATA_API_KEY }
);

// TradingView API client
const tradingViewClient = createApiClient(
  'https://api.tradingview.com/v1', // Replace with actual TradingView API
  { 'Authorization': `Bearer ${process.env.TRADINGVIEW_API_KEY}` }
);

// Mock broker API client
const mockBrokerClient = createApiClient(
  'https://api.mockbroker.com/v1', // Replace with actual mock broker API
  { 
    'X-API-KEY': process.env.MOCK_BROKER_API_KEY,
    'X-SECRET-KEY': process.env.MOCK_BROKER_SECRET
  }
);

module.exports = {
  createApiClient,
  marketDataClient,
  tradingViewClient,
  mockBrokerClient
}; 