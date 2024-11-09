const express = require('express');
const cors = require('cors');
const axios = require('axios')
require('dotenv').config()
console.log('API Key loaded:', process.env.ALPHA_VANTAGE_API_KEY ? 'Yes' : 'No');

const MOCK_DATA = require('./mockData');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000


// Function to get stock data from Alpha Vantage
async function fetchAlphaVantage(symbol) {
    try {
        console.log('Using API key:', process.env.ALPHA_VANTAGE_API_KEY?.substring(0, 5) + '...');

        // Url for company overview data
        const overviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
        console.log("Calling overview URL:", overviewUrl);

        const overviewResponse = await axios.get(overviewUrl)
        console.log("Overview Response:", JSON.stringify(overviewResponse.data, null, 2));

        const priceUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
        console.log("Calling price URL:", priceUrl);

        const priceResponse = await axios.get(priceUrl)
        console.log("Price Response:", JSON.stringify(priceResponse.data, null, 2));
        if (overviewResponse.data.Information?.includes('rate limit') ||
            priceResponse.data.Information?.includes('rate limit')) {
            console.log('API rate limited, using mock data for:', symbol);
            if (MOCK_DATA[symbol]) {
                return {
                    Symbol: symbol,
                    MarketCap: MOCK_DATA[symbol].overview.MarketCapitalization,
                    EPS: MOCK_DATA[symbol].overview.EPS,
                    PERatio: MOCK_DATA[symbol].overview.PERatio,
                    Volume: "20000000", // Mock current day volume
                    NextEarningsDate: MOCK_DATA[symbol].overview.NextEarningsDate,
                    Price: MOCK_DATA[symbol].daily["2024-11-07"].close // Most recent mock price
                };
            }
            return null; // If we don't have mock data for this symbol
        }


        const overview = overviewResponse.data
        const quote = priceResponse.data['Global Quote']

        if (!quote || !overview) {
            console.log(`No data found for ${symbol}`);
            return null;
        }
        console.log('Overview Response:', overviewResponse.data);
        console.log('Price Response:', priceResponse.data);
        return {
            Symbol: symbol,
            MarketCap: overview.MarketCapitalization || 'N/A',
            EPS: overview.EPS || 'N/A',
            PERatio: overview.PERatio || 'N/A',
            Volume: quote['06. volume'] || 'N/A',
            NextEarningsDate: overview.NextEarningsDate || 'N/A',
            Price: quote['05. price'] || 'N/A'
        }

    } catch (error) {
        console.log(`Error fetching data for ${symbol}: `, error);
        // Try mock data on error
        if (MOCK_DATA[symbol]) {
            console.log('Using mock data after error for:', symbol);
            return {
                Symbol: symbol,
                MarketCap: MOCK_DATA[symbol].overview.MarketCapitalization,
                EPS: MOCK_DATA[symbol].overview.EPS,
                PERatio: MOCK_DATA[symbol].overview.PERatio,
                Volume: "20000000",
                NextEarningsDate: MOCK_DATA[symbol].overview.NextEarningsDate,
                Price: MOCK_DATA[symbol].daily["2024-11-07"].close
            };
        }
        return null;
    }

}

function getMockDataInRange(ticker, startDate, endDate) {
    if (!MOCK_DATA[ticker]) return null;

    const mockDataInRange = Object.entries(MOCK_DATA[ticker].daily)
        .filter(([date]) => {
            const dataDate = new Date(date);
            return dataDate >= new Date(startDate) && dataDate <= new Date(endDate);
        })
        .map(([date, data]) => ({
            Date: date,
            Price: parseFloat(data.close),
            Volume: parseInt(data.volume)
        }))
        .sort((a, b) => new Date(a.Date) - new Date(b.Date));

    console.log("Mock data prepared for", ticker, ":", mockDataInRange);
    return mockDataInRange;
}

// Endpoint to get summary data for mulitple stocks
app.get('/api/get_summary', async (req, res) => {
    try {
        const { tickers } = req.query
        const tickerList = tickers.split(',')

        const summaryData = []

        for (const ticker of tickerList) {
            const cachedData = cache.get(ticker)

            if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
                summaryData.push(cachedData.data)
                continue
            }

            const data = await fetchAlphaVantage(ticker)
            if (data) {
                cache.set(ticker, {
                    data,
                    timestamp: Date.now()
                })
                summaryData.push(data)
            }
        }
        res.json(summaryData)
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({ error: 'Failed to fetch stock data' })
    }

})


app.get('/api/get_data', async (req, res) => {
    const { ticker, startDate, endDate } = req.query;
    console.log("Requested:", { ticker, startDate, endDate });
    try {

        // Try real API first
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;
        const response = await axios.get(url);
        const dailyData = response.data['Time Series (Daily)'];

        // Check if we should use mock data
        if (response.data.Information?.includes('rate limit') || !dailyData) {
            console.log('Using mock data for:', ticker);
            const mockDataInRange = getMockDataInRange(ticker, startDate, endDate);

            if (mockDataInRange) {
                return res.json({
                    startPrice: mockDataInRange[0]?.Price,
                    endPrice: mockDataInRange[mockDataInRange.length - 1]?.Price,
                    stockData: mockDataInRange
                });
            }
            return res.json({ stockData: [] });
        }

        // Process real API data
        const filteredData = Object.entries(dailyData)
            .filter(([date]) => {
                const dataDate = new Date(date);
                return dataDate >= new Date(startDate) && dataDate <= new Date(endDate);
            })
            .map(([date, data]) => ({
                Date: date,
                Price: parseFloat(data['4. close']),
                Volume: parseInt(data['5. volume'])
            }))
            .sort((a, b) => new Date(a.Date) - new Date(b.Date));

        return res.json({
            startPrice: filteredData[0]?.Price,
            endPrice: filteredData[filteredData.length - 1]?.Price,
            stockData: filteredData
        });

    } catch (error) {
        console.error('Error:', error);

        // Try mock data as fallback
        const mockDataInRange = getMockDataInRange(ticker, startDate, endDate);
        if (mockDataInRange) {
            console.log('Falling back to mock data after error');
            return res.json({
                startPrice: mockDataInRange[0]?.Price,
                endPrice: mockDataInRange[mockDataInRange.length - 1]?.Price,
                stockData: mockDataInRange
            });
        }

        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
});
// These should be at the root level, not inside get_data
app.get('/', (req, res) => {
    res.send('Welcome to the Stock Data API!');
});

app.get('/api/get_all_tickers', async (req, res) => {
    try {
        // This endpoint should return an array of available tickers
        // You might want to cache this data as it won't change often
        const response = await axios.get(
            `https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
        );

        // The response is a CSV, so we need to parse it
        const tickers = response.data
            .split('\n')
            .slice(1) // Skip header row
            .map(line => line.split(',')[0]) // Get just the ticker symbol
            .filter(Boolean); // Remove any empty values

        res.json(tickers);
    } catch (error) {
        console.error('Error fetching tickers:', error);
        res.status(500).json({ error: 'Failed to fetch available tickers' });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});