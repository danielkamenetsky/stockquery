const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Dummy data
const tickers = ['AAPL', 'GOOGL', 'MSFT', 'AMZN'];
const summaryData = {
    AAPL: { name: "Apple Inc.", marketCap: "2.5T" },
    GOOGL: { name: "Alphabet Inc.", marketCap: "1.5T" },
    MSFT: { name: "Microsoft Corporation", marketCap: "2.2T" },
    AMZN: { name: "Amazon.com, Inc.", marketCap: "1.7T" }
};

const allData = [
    { symbol: 'AAPL', date: '2024-01-01', price: 150 },
    { symbol: 'AAPL', date: '2024-01-02', price: 152 },
    { symbol: 'GOOGL', date: '2024-01-01', price: 2800 },
    { symbol: 'GOOGL', date: '2024-01-02', price: 2820 },
    // Add more mock data as needed
];

app.get('/', (req, res) => {
  res.send('Welcome to the Dummy API!'); // You can customize this message
});


// Endpoints
app.get('/api/tickers', (req, res) => {
    res.json(tickers);
});

app.post('/api/get_data', (req, res) => {
    const { tickers } = req.body;
    const filteredData = allData.filter(item => tickers.includes(item.symbol));
    res.json(filteredData);
});

app.post('/api/get_summary', (req, res) => {
    const { tickers } = req.body;
    const summaries = tickers.map(ticker => summaryData[ticker] || {});
    res.json(summaries);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
