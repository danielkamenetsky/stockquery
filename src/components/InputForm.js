import React, { useState, useEffect } from 'react';
import Chart from './Chart';
import CompanySummaryTable from './CompanySummaryTable';
import '../styles/TableStyles.css';
import Select from 'react-select';

export default function InputForm() {
    const [tickers, setTickers] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [validTickers, setValidTickers] = useState([]);
    const [error, setError] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [summaryData, setSummaryData] = useState([]);
    const [selectedTickers, setSelectedTickers] = useState([]);

    const apiUrl = 'http://localhost:5001';

    useEffect(() => {
        const fetchValidTickers = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/get_tickers`);
                const data = await response.json();
                setValidTickers(data);
            } catch (error) {
                console.error('Error fetching valid tickers:', error);
            }
        };

        fetchValidTickers();
    }, []);

    const fetchData = async () => {
        if (tickers.length === 0 || !startDate || !endDate) return;
    
        try {
            // Fetch stock data for each ticker
            const stockDataPromises = tickers.map(ticker =>
                fetch(`${apiUrl}/api/get_data?ticker=${ticker}&startDate=${startDate}&endDate=${endDate}`)
                    .then(response => response.json())
            );
    
            const stockDataResults = await Promise.all(stockDataPromises);
            
            // Format the data for the Chart component
            const formattedChartData = stockDataResults.map(result => {
                return result.stockData.map(item => ({
                    date: new Date(item.Date),
                    price: parseFloat(item.Price)
                }));
            });
    
            setFilteredData(formattedChartData);
    
            // Fetch summary data
            const summaryResponse = await fetch(`${apiUrl}/api/get_summary?tickers=${tickers.join(',')}`);
            const summaryData = await summaryResponse.json();
    
            // Log the raw summary data for debugging
            console.log("input form", summaryData);
            const mcapValue = summaryData[0].MarketCap;
            console.log(mcapValue)
    
            // Format summary data to match the expected structure
            const formattedSummaryData = summaryData.map(company => ({
                symbol: company.Symbol,
                marketCap: company.MarketCap, // Use a parsing function
                eps: company.EPS,
                peRatio: company.PERatio ?? 'N/A', // Set default if missing
                volume: company.Volume, // Use a parsing function
                nextEarningsDate: company.NextEarningsDate // Use a formatting function
            }));
    
            setSummaryData(formattedSummaryData);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to fetch data. Please try again.');
        }
    };


    function handleTickersChange(selectedOptions) {
        const selectedValues = selectedOptions.map(option => option.value);
        setTickers(selectedValues);
        setSelectedTickers(selectedOptions);
    }

    function handleStartDateChange(event) {
        setStartDate(event.target.value);
    }

    function handleEndDateChange(event) {
        setEndDate(event.target.value);
    }

    const tickerOptions = validTickers
        .map(ticker => ({ value: ticker, label: ticker }));

    function handleSubmit(event) {
        event.preventDefault();
        if (tickers.every(t => validTickers.includes(t))) {
            fetchData();
            setError('');
        } else {
            setError('Invalid ticker symbol. Please enter valid symbols.');
        }
    }

    return (
        <div className="App">
            <form onSubmit={handleSubmit}>
                <label>
                    Stock Ticker:
                    <Select
                        value={selectedTickers}
                        onChange={handleTickersChange}
                        options={tickerOptions}
                        isClearable={true}
                        placeholder="Type or select stock tickers"
                        isSearchable={true}
                        isMulti={true}
                    />
                </label>
                <label>
                    Start Date:
                    <input
                        type="date"
                        value={startDate}
                        onChange={handleStartDateChange}
                    />
                </label>
                <label>
                    End Date:
                    <input
                        type="date"
                        value={endDate}
                        onChange={handleEndDateChange}
                    />
                </label>
                <input type="submit" value="Submit" />
            </form>
            <Chart data={filteredData} tickers={tickers} />
            <CompanySummaryTable data={summaryData} />
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    );
}