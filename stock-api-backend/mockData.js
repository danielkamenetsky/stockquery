// mockData.js
const MOCK_DATA = {
    'MSFT': {
        overview: {
            Symbol: "MSFT",
            MarketCapitalization: "2800000000000",
            EPS: "11.24",
            PERatio: "36.5",
            NextEarningsDate: "2024-01-15"
        },
        daily: {
            "2024-11-07": { close: "368.80", volume: "18245000" },
            "2024-11-06": { close: "366.68", volume: "17458000" },
            "2024-11-05": { close: "500.02", volume: "19258000" },
            "2024-11-04": { close: "364.45", volume: "18157000" },
            "2024-11-03": { close: "363.20", volume: "17856000" }
        }
    },
    'AAPL': {
        overview: {
            Symbol: "AAPL",
            MarketCapitalization: "2900000000000",
            EPS: "6.42",
            PERatio: "28.75",
            NextEarningsDate: "2024-01-25"
        },
        daily: {
            "2024-11-07": { close: "182.89", volume: "22145000" },
            "2024-11-06": { close: "181.75", volume: "21458000" },
            "2024-11-05": { close: "180.95", volume: "23258000" },
            "2024-11-04": { close: "179.80", volume: "20157000" },
            "2024-11-03": { close: "17.65", volume: "19856000" }
        }
    }
};

module.exports = MOCK_DATA;