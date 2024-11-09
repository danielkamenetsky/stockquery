    const express = require('express');
    const cors = require('cors');
    const fs = require('fs');
    const csv = require('csv-parser');

    const app = express();
    const PORT = 5001;

    app.use(cors());
    app.use(express.json());

    const filePath = './data/stock_data.csv'; // Update with your CSV file path

    // In-memory storage for stock data and tickers
    let stockData = [];
    let tickers = new Set();

    // Load CSV data into memory on server start
    function loadCSVData() {
        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => {
                    stockData.push(row);
                    tickers.add(row.Symbol);
                })
                .on('end', () => {
                    console.log('CSV data loaded into memory');
                    resolve();
                })
                .on('error', reject);
        });
    }

    // API to search for tickers
    app.get('/api/search_ticker', (req, res) => {
        const { query } = req.query;
        const results = Array.from(tickers).filter(ticker => 
            ticker.toLowerCase().includes(query.toLowerCase())
        );
        res.json(results);
    });

    // API to get stock data based on ticker and date range
    app.get('/api/get_data', (req, res) => {
        const { ticker, startDate, endDate } = req.query;
        
        const filteredData = stockData.filter(row => {
            const rowDate = new Date(row.Date);
            return row.Symbol === ticker && rowDate >= new Date(startDate) && rowDate <= new Date(endDate);
        });

        if (filteredData.length > 0) {
            const startPrice = filteredData[0].Price;
            const endPrice = filteredData[filteredData.length - 1].Price;
            
            res.json({
                startPrice,
                endPrice,
                stockData: filteredData
            });
        } else {
            res.status(404).json({ message: 'No data found for the given ticker and date range.' });
        }
    });

    // Endpoint to get all tickers
    app.get('/api/get_tickers', (req, res) => {
        res.json(Array.from(tickers));
    });

    // API to get summary data for given tickers
    app.get('/api/get_summary', (req, res) => {
    const { tickers } = req.query;
    const tickerList = tickers.split(',');

    console.log('Requested Tickers:', tickerList);

    const summaryData = tickerList.map(ticker => {
        const latestData = stockData
            .filter(row => row.Symbol === ticker)
            .sort((a, b) => new Date(b.Date) - new Date(a.Date))[0];

        console.log('Latest Data for Ticker:', ticker, latestData);

        return latestData ? {
            Symbol: ticker,
            Price: latestData.Price,
            MarketCap: latestData['Market Cap'],
            EPS: latestData.EPS,
            PERatio: latestData['PE Ratio'],
            Volume: latestData.Volume,
            NextEarningsDate: latestData['Next Earnings Date']
        } : null;
    }).filter(data => data !== null);

    console.log('Summary Data:', summaryData); // Log the final summary data
    res.json(summaryData);
    });


    app.get('/', (req, res) => {
        res.send('Welcome to the Stock Data API!');
    });

    // Start server after loading CSV data
    loadCSVData()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Server is running on http://localhost:${PORT}`);
            });
        })
        .catch(error => {
            console.error('Failed to load CSV data:', error);
            process.exit(1);
        });