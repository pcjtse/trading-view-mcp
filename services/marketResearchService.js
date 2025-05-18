const { marketDataClient } = require('../utils/apiClient');
const logger = require('../utils/logger');

/**
 * Get market news
 * @param {Array} symbols - Array of stock symbols to filter news by (optional)
 * @param {number} limit - Maximum number of news items to return
 * @returns {Promise<Array>} News articles
 */
const getMarketNews = async (symbols = [], limit = 10) => {
  try {
    logger.info(`Getting market news for ${symbols.length ? symbols.join(', ') : 'general market'}`);
    
    // Mock implementation
    // In a real implementation, this would call a financial news API
    
    const newsCategories = [
      'Earnings Reports',
      'Market Analysis',
      'Economy',
      'Company News',
      'Industry Trends',
      'Mergers & Acquisitions',
      'IPOs',
      'Regulatory News',
      'Technology',
      'Global Markets'
    ];
    
    const sources = [
      'Bloomberg',
      'CNBC',
      'Reuters',
      'Yahoo Finance',
      'Wall Street Journal',
      'Financial Times',
      'MarketWatch',
      'Seeking Alpha',
      'Barron\'s',
      'Investopedia'
    ];
    
    const mockTitles = [
      'Markets Rally as Inflation Data Shows Signs of Easing',
      'Fed Signals Possible Rate Cut in Coming Months',
      'Tech Stocks Surge on Strong Earnings Reports',
      'Oil Prices Drop Amid Global Supply Concerns',
      'Retail Sales Beat Expectations, Consumer Spending Remains Strong',
      'Housing Market Cools as Mortgage Rates Rise',
      'Manufacturing Index Shows Expansion for Third Consecutive Month',
      'Cryptocurrency Market Faces Regulatory Scrutiny',
      'Global Economic Outlook Improves Despite Geopolitical Tensions',
      'Bond Yields Retreat from Recent Highs'
    ];
    
    const news = [];
    
    for (let i = 0; i < limit; i++) {
      const date = new Date();
      date.setHours(date.getHours() - Math.floor(Math.random() * 72)); // Random time within last 3 days
      
      let title = mockTitles[i % mockTitles.length];
      let symbol = null;
      
      // If symbols provided, randomly assign one to some news items
      if (symbols.length && Math.random() > 0.5) {
        symbol = symbols[Math.floor(Math.random() * symbols.length)];
        title = `${symbol}: ${title}`;
      }
      
      news.push({
        id: `news-${Date.now()}-${i}`,
        title,
        summary: `This is a mock summary for the news article "${title}".`,
        source: sources[Math.floor(Math.random() * sources.length)],
        category: newsCategories[Math.floor(Math.random() * newsCategories.length)],
        url: 'https://example.com/news',
        publishedAt: date.toISOString(),
        relatedSymbols: symbol ? [symbol] : []
      });
    }
    
    return news;
    
    /* Real implementation would look like this:
    const params = {
      limit
    };
    
    if (symbols.length) {
      params.symbols = symbols.join(',');
    }
    
    const response = await marketDataClient.get('/news', { params });
    return response.data;
    */
  } catch (error) {
    logger.error(`Error getting market news: ${error.message}`);
    throw new Error(`Failed to get market news: ${error.message}`);
  }
};

/**
 * Get sector performance
 * @returns {Promise<Array>} Sector performance data
 */
const getSectorPerformance = async () => {
  try {
    logger.info('Getting sector performance');
    
    // Mock implementation
    // In a real implementation, this would call a market data API
    
    const sectors = [
      'Technology',
      'Healthcare',
      'Financials',
      'Consumer Discretionary',
      'Communication Services',
      'Industrials',
      'Consumer Staples',
      'Energy',
      'Utilities',
      'Materials',
      'Real Estate'
    ];
    
    const sectorData = sectors.map(sector => {
      // Generate random performance data
      const dailyChange = (Math.random() * 4) - 2; // -2% to 2%
      const weeklyChange = (Math.random() * 8) - 3; // -3% to 5%
      const monthlyChange = (Math.random() * 15) - 5; // -5% to 10%
      const yearlyChange = (Math.random() * 40) - 10; // -10% to 30%
      
      return {
        sector,
        performance: {
          daily: dailyChange,
          weekly: weeklyChange,
          monthly: monthlyChange,
          yearly: yearlyChange
        },
        momentum: dailyChange > 0 ? 'positive' : 'negative',
        volatility: Math.random() * 15 + 5, // 5% to 20%
        timestamp: new Date().toISOString()
      };
    });
    
    return sectorData;
    
    /* Real implementation would look like this:
    const response = await marketDataClient.get('/sectors/performance');
    return response.data;
    */
  } catch (error) {
    logger.error(`Error getting sector performance: ${error.message}`);
    throw new Error(`Failed to get sector performance: ${error.message}`);
  }
};

/**
 * Get economic indicators
 * @returns {Promise<Object>} Economic indicators data
 */
const getEconomicIndicators = async () => {
  try {
    logger.info('Getting economic indicators');
    
    // Mock implementation
    // In a real implementation, this would call a market data API
    
    const indicators = {
      gdp: {
        value: 2.5 + (Math.random() * 1 - 0.5), // 2% to 3%
        previous: 2.2 + (Math.random() * 1 - 0.5),
        trend: 'improving'
      },
      inflation: {
        value: 3.2 + (Math.random() * 1 - 0.5), // 2.7% to 3.7%
        previous: 3.5 + (Math.random() * 1 - 0.5),
        trend: 'improving'
      },
      unemployment: {
        value: 3.6 + (Math.random() * 0.6 - 0.3), // 3.3% to 3.9%
        previous: 3.7 + (Math.random() * 0.6 - 0.3),
        trend: 'stable'
      },
      interestRate: {
        value: 5.25 + (Math.random() * 0.5 - 0.25), // 5% to 5.5%
        previous: 5.0 + (Math.random() * 0.5 - 0.25),
        trend: 'stable'
      },
      consumerSentiment: {
        value: 75 + (Math.random() * 10 - 5), // 70 to 80
        previous: 73 + (Math.random() * 10 - 5),
        trend: 'improving'
      },
      retailSales: {
        value: 0.3 + (Math.random() * 0.6 - 0.3), // 0% to 0.6%
        previous: 0.2 + (Math.random() * 0.6 - 0.3),
        trend: 'improving'
      },
      housingStarts: {
        value: 1400 + (Math.random() * 200 - 100), // 1300k to 1500k
        previous: 1350 + (Math.random() * 200 - 100),
        trend: 'declining'
      },
      timestamp: new Date().toISOString()
    };
    
    return indicators;
    
    /* Real implementation would look like this:
    const response = await marketDataClient.get('/economic/indicators');
    return response.data;
    */
  } catch (error) {
    logger.error(`Error getting economic indicators: ${error.message}`);
    throw new Error(`Failed to get economic indicators: ${error.message}`);
  }
};

/**
 * Analyze portfolio diversification
 * @param {Object} portfolio - Portfolio data
 * @returns {Promise<Object>} Diversification analysis
 */
const analyzePortfolioDiversification = async (portfolio) => {
  try {
    logger.info('Analyzing portfolio diversification');
    
    // In a real implementation, we would get sector data from an API
    // For mock purposes, we'll use predefined data
    
    const sectorMap = {
      AAPL: 'Technology',
      MSFT: 'Technology',
      GOOGL: 'Communication Services',
      AMZN: 'Consumer Discretionary',
      META: 'Communication Services',
      TSLA: 'Consumer Discretionary',
      NVDA: 'Technology',
      JPM: 'Financials',
      JNJ: 'Healthcare',
      V: 'Financials',
      PG: 'Consumer Staples',
      UNH: 'Healthcare',
      HD: 'Consumer Discretionary',
      BAC: 'Financials',
      XOM: 'Energy',
      AVGO: 'Technology',
      MA: 'Financials',
      COST: 'Consumer Staples',
      DIS: 'Communication Services',
      MRK: 'Healthcare',
      // Default sector for unknown symbols
      DEFAULT: 'Other'
    };
    
    // Calculate position values and sector allocation
    const positions = portfolio.positions || [];
    const positionValues = positions.map(position => ({
      symbol: position.symbol,
      value: position.quantity * position.currentPrice,
      sector: sectorMap[position.symbol] || sectorMap.DEFAULT
    }));
    
    const totalPositionValue = positionValues.reduce((total, position) => total + position.value, 0);
    
    // Group by sector
    const sectorAllocation = {};
    positionValues.forEach(position => {
      const { sector, value } = position;
      if (!sectorAllocation[sector]) {
        sectorAllocation[sector] = 0;
      }
      sectorAllocation[sector] += value;
    });
    
    // Calculate percentages
    const sectorPercentages = {};
    for (const [sector, value] of Object.entries(sectorAllocation)) {
      sectorPercentages[sector] = (value / totalPositionValue) * 100;
    }
    
    // Calculate concentration metrics
    const concentrationRisk = {
      topHolding: {
        symbol: '',
        percentage: 0
      },
      topSector: {
        sector: '',
        percentage: 0
      }
    };
    
    // Find top holding
    const sortedPositions = [...positionValues].sort((a, b) => b.value - a.value);
    if (sortedPositions.length > 0) {
      const topPosition = sortedPositions[0];
      concentrationRisk.topHolding = {
        symbol: topPosition.symbol,
        percentage: (topPosition.value / totalPositionValue) * 100
      };
    }
    
    // Find top sector
    const sortedSectors = Object.entries(sectorPercentages)
      .sort(([, percentA], [, percentB]) => percentB - percentA);
    
    if (sortedSectors.length > 0) {
      concentrationRisk.topSector = {
        sector: sortedSectors[0][0],
        percentage: sortedSectors[0][1]
      };
    }
    
    // Calculate diversification score (0-100)
    // Higher score means better diversification
    let diversificationScore = 100;
    
    // Penalize for high concentration in top holding
    if (concentrationRisk.topHolding.percentage > 20) {
      diversificationScore -= (concentrationRisk.topHolding.percentage - 20) * 2;
    }
    
    // Penalize for high concentration in top sector
    if (concentrationRisk.topSector.percentage > 30) {
      diversificationScore -= (concentrationRisk.topSector.percentage - 30) * 1.5;
    }
    
    // Penalize for low number of positions
    if (positions.length < 10) {
      diversificationScore -= (10 - positions.length) * 5;
    }
    
    // Penalize for low number of sectors
    if (Object.keys(sectorPercentages).length < 5) {
      diversificationScore -= (5 - Object.keys(sectorPercentages).length) * 10;
    }
    
    // Ensure score is within 0-100 range
    diversificationScore = Math.max(0, Math.min(100, diversificationScore));
    
    return {
      positions: positionValues,
      sectorAllocation: sectorPercentages,
      concentrationRisk,
      diversificationScore,
      recommendations: generateDiversificationRecommendations(sectorPercentages, positionValues),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error(`Error analyzing portfolio diversification: ${error.message}`);
    throw new Error(`Failed to analyze portfolio diversification: ${error.message}`);
  }
};

/**
 * Generate diversification recommendations
 * @param {Object} sectorPercentages - Sector allocation percentages
 * @param {Array} positions - Position values with sector data
 * @returns {Array} Recommendations
 */
const generateDiversificationRecommendations = (sectorPercentages, positions) => {
  const recommendations = [];
  
  // Check for overconcentration in sectors
  const overconcentratedSectors = Object.entries(sectorPercentages)
    .filter(([, percentage]) => percentage > 30)
    .map(([sector]) => sector);
  
  if (overconcentratedSectors.length > 0) {
    recommendations.push({
      type: 'sector_overconcentration',
      severity: 'high',
      message: `Your portfolio is overconcentrated in the following sectors: ${overconcentratedSectors.join(', ')}. Consider reducing exposure to these sectors.`
    });
  }
  
  // Check for underrepresentation in sectors
  const missingOrLowSectors = [
    'Technology',
    'Healthcare',
    'Financials',
    'Consumer Discretionary',
    'Communication Services',
    'Industrials',
    'Consumer Staples',
    'Energy',
    'Utilities',
    'Materials',
    'Real Estate'
  ].filter(sector => !sectorPercentages[sector] || sectorPercentages[sector] < 5);
  
  if (missingOrLowSectors.length > 0) {
    recommendations.push({
      type: 'sector_underrepresentation',
      severity: 'medium',
      message: `Your portfolio has low or no exposure to: ${missingOrLowSectors.join(', ')}. Consider adding positions in these sectors for better diversification.`
    });
  }
  
  // Check for position concentration
  const totalValue = positions.reduce((sum, position) => sum + position.value, 0);
  const highConcentrationPositions = positions
    .filter(position => (position.value / totalValue) * 100 > 15)
    .map(position => position.symbol);
  
  if (highConcentrationPositions.length > 0) {
    recommendations.push({
      type: 'position_concentration',
      severity: 'medium',
      message: `You have high concentration in the following positions: ${highConcentrationPositions.join(', ')}. Consider reducing these positions for better risk management.`
    });
  }
  
  // Check for insufficient diversification
  if (positions.length < 10) {
    recommendations.push({
      type: 'insufficient_positions',
      severity: 'high',
      message: `Your portfolio has only ${positions.length} positions. Consider adding more positions across different sectors for better diversification.`
    });
  }
  
  return recommendations;
};

module.exports = {
  getMarketNews,
  getSectorPerformance,
  getEconomicIndicators,
  analyzePortfolioDiversification
}; 