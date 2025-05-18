# TradingView MCP Server

A Market Control Platform (MCP) server that interacts with the TradingView platform to analyze stocks, execute mock trades, and perform market research. The server implements the Model Context Protocol to serve as a context provider for large language models (LLMs).

## Features

### 1. Stock Performance Analysis

- Analyze stock technical indicators (SMA, EMA, RSI, MACD)
- Generate buy/sell recommendations with confidence levels
- View TradingView indicators and ratings
- Fetch historical stock data

### 2. Mock Trading System

- Execute buy/sell orders on a mock trading account
- Support for market and limit orders
- Track portfolio performance and transaction history
- Analyze returns over different time periods

### 3. Market Research

- Access market news and filter by symbols
- Track sector performance
- Monitor economic indicators
- Analyze portfolio diversification
- Get news related to portfolio holdings

### 4. Model Context Protocol Integration

- Implements Model Context Protocol (MCP) standard
- Serves as a context provider for LLMs
- Exposes stock analysis, trading, and research capabilities
- Structured data responses for AI consumption

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- npm (v6+)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/trading-view-mcp.git
   cd trading-view-mcp
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   ```
   cp config.env .env
   ```
   Edit the `.env` file to add your API keys and adjust MCP settings.

4. Start the server:
   ```
   npm start
   ```

For development with auto-reload:
   ```
   npm run dev
   ```

## Model Context Protocol (MCP) Integration

This server implements the Model Context Protocol, allowing it to serve as a context provider for large language models (LLMs).

### MCP Endpoints

- `GET /mcp-info` - Get basic information about the MCP provider
- `GET /api/mcp/capabilities` - Get detailed capabilities of the MCP provider
- `POST /api/mcp/context` - Request context data for LLM consumption

### Using as an MCP Provider

To use this server as an MCP provider for your LLM:

1. Ensure the MCP integration is enabled in your environment:
   ```
   MCP_ENABLED=true
   MCP_PROVIDER_NAME=tradingview-mcp
   MCP_VERSION=1.0
   ```

2. Configure your LLM client to connect to this server by using the MCP endpoints.

3. Send requests to the `/api/mcp/context` endpoint in the following format:
   ```json
   {
     "type": "stock_analysis",
     "parameters": {
       "symbol": "AAPL",
       "timeframe": "1d"
     }
   }
   ```

### Available MCP Request Types

1. **Stock Analysis:**
   ```json
   {
     "type": "stock_analysis",
     "parameters": {
       "symbol": "AAPL",
       "timeframe": "1w"
     }
   }
   ```

2. **Portfolio Management:**
   ```json
   {
     "type": "portfolio",
     "parameters": {
       "action": "performance",
       "period": "1m"
     }
   }
   ```

3. **Trade Execution:**
   ```json
   {
     "type": "trade_execution",
     "parameters": {
       "symbol": "MSFT",
       "action": "buy",
       "quantity": 10,
       "type": "market"
     }
   }
   ```

4. **Market Research:**
   ```json
   {
     "type": "market_research",
     "parameters": {
       "type": "news",
       "symbols": ["AAPL", "MSFT"],
       "limit": 5
     }
   }
   ```

## API Documentation

### Stock Analysis Endpoints

- `GET /api/analysis/stock/:symbol` - Get stock analysis and recommendation
- `POST /api/analysis/batch` - Analyze multiple stocks in batch
- `GET /api/analysis/tradingview/:symbol` - Get TradingView indicators
- `GET /api/analysis/historical/:symbol` - Get historical data

### Trading Endpoints

- `GET /api/trading/portfolio` - Get current portfolio
- `POST /api/trading/order` - Execute a trade order
- `GET /api/trading/performance` - Get portfolio performance
- `PUT /api/trading/portfolio/update` - Update portfolio with latest prices
- `POST /api/trading/portfolio/reset` - Reset mock portfolio

### Market Research Endpoints

- `GET /api/research/news` - Get market news
- `GET /api/research/sectors` - Get sector performance
- `GET /api/research/economic` - Get economic indicators
- `GET /api/research/portfolio/diversification` - Analyze portfolio diversification
- `GET /api/research/portfolio/news` - Get news related to portfolio

## Implementation Notes

This implementation uses mock data for demonstration purposes. In a production environment, you would need to:

1. Integrate with real market data providers (Alpha Vantage, Yahoo Finance, etc.)
2. Connect to TradingView's API (or use web scraping if an API is not available)
3. Implement data persistence (file storage or a database of your choice)
4. Implement authentication and security measures

## License

MIT 