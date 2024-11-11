// Import necessary React stuff and other components we need
import React, { useState } from 'react';
import Chart from './Chart';
import CompanySummaryTable from './CompanySummaryTable';
import './ModernContainer.css';
import Select from 'react-select';


const POPULAR_TICKERS = [
    { value: 'AAPL', label: 'Apple (AAPL)' },
    { value: 'MSFT', label: 'Microsoft (MSFT)' },
    { value: 'GOOGL', label: 'Alphabet (GOOGL)' },
    { value: 'AMZN', label: 'Amazon (AMZN)' },
    { value: 'META', label: 'Meta (META)' },
    { value: 'NVDA', label: 'NVIDIA (NVDA)' },
    { value: 'TSLA', label: 'Tesla (TSLA)' },
    { value: 'JPM', label: 'JPMorgan (JPM)' },
    { value: 'BAC', label: 'Bank of America (BAC)' },
    { value: 'WMT', label: 'Walmart (WMT)' },
    { value: 'DIS', label: 'Disney (DIS)' },
    { value: 'NFLX', label: 'Netflix (NFLX)' },
    { value: 'PYPL', label: 'PayPal (PYPL)' },
    { value: 'INTC', label: 'Intel (INTC)' },
    { value: 'AMD', label: 'AMD (AMD)' }
];

// Create and export our main component
export default function InputForm() {
    // Set up all our state variables using useState
    const [tickers, setTickers] = useState([]); // Store selected stock symbols
    const [startDate, setStartDate] = useState(''); // Store start date
    const [endDate, setEndDate] = useState(''); // Store end date
    const [error, setError] = useState(''); // Store any error messages
    const [filteredData, setFilteredData] = useState([]); // Store data for the chart
    const [summaryData, setSummaryData] = useState([]); // Store company info data
    const [selectedTickers, setSelectedTickers] = useState([]); // Store selected options for the dropdown

    // URL where our backend server is running
    const apiUrl = 'https://stock-query-app-2270b4926af7.herokuapp.com/';
    const [setAvailableDateRange] = useState({ oldest: null, newest: null });


    // Function that fetches data when form is submitted
    const fetchData = async () => {
        // Don't do anything if required fields are empty
        if (tickers.length === 0 || !startDate || !endDate) return;

        try {
            // Create an array of promises for fetching each ticker's historical data
            const stockDataPromises = tickers.map(ticker =>
                fetch(`${apiUrl}/api/get_data?ticker=${ticker}&startDate=${startDate}&endDate=${endDate}`)
                    .then(response => response.json())
            );

            // Wait for all historical data to be fetched
            const stockDataResults = await Promise.all(stockDataPromises);
            console.log("Stock data results:", stockDataResults); // Added debug log

            if (stockDataResults[0]?.dateRange) {
                setAvailableDateRange({
                    oldest: stockDataResults[0].dateRange.oldestAvailable,
                    newest: stockDataResults[0].dateRange.newestAvailable
                });
            }
            // Convert the raw data into format needed for the chart
            const formattedChartData = stockDataResults.map(result => {
                return result.stockData.map(item => ({
                    date: new Date(item.Date),
                    price: parseFloat(item.Price)
                }));
            });
            console.log("Formatted chart data:", formattedChartData);  // Add this

            // Update the chart data state
            setFilteredData(formattedChartData);

            // Fetch company summary information for all tickers
            const summaryResponse = await fetch(`${apiUrl}/api/get_summary?tickers=${tickers.join(',')}`);
            const summaryData = await summaryResponse.json();

            // Log data for debugging
            console.log("input form", summaryData);
            const mcapValue = summaryData[0].MarketCap;
            console.log(mcapValue)

            // Convert the raw summary data into the format our table component expects
            const formattedSummaryData = summaryData.map(company => ({
                symbol: company.Symbol,
                marketCap: company.MarketCap,
                eps: company.EPS,
                peRatio: company.PERatio ?? 'N/A', // Use 'N/A' if PERatio is null/undefined
                volume: company.Volume,
                nextEarningsDate: company.NextEarningsDate
            }));

            // Update the summary data state
            setSummaryData(formattedSummaryData);
        } catch (error) {
            // If anything goes wrong, log it and show error message
            console.error('Error fetching data:', error);
            setError('Failed to fetch data. Please try again.');
        }
    };

    // Function that handles when user selects/changes tickers in dropdown
    function handleTickersChange(selectedOptions) {
        setSelectedTickers(selectedOptions || []);
        setTickers(selectedOptions ? selectedOptions.map(option => option.value) : []);
    }

    // Function that handles when start date is changed
    function handleStartDateChange(event) {
        setStartDate(event.target.value);
    }

    // Function that handles when end date is changed
    function handleEndDateChange(event) {
        setEndDate(event.target.value);
    }

    // Function that handles form submission
    function handleSubmit(event) {
        event.preventDefault(); // Prevent page refresh
        fetchData(); // Get the data
        setError(''); // Clear any previous errors
    }

    // The actual JSX/HTML we're rendering
    return (
        <div className="App">
            <form onSubmit={handleSubmit}>
                <label>
                    Stock Ticker:
                    {/* Dropdown component for selecting stocks */}
                    <Select
                        value={selectedTickers}
                        onChange={handleTickersChange}
                        options={POPULAR_TICKERS}
                        isClearable={true}
                        placeholder="Enter stock tickers (e.g., AAPL, MSFT)"
                        isSearchable={true}
                        isMulti={true}
                        styles={{
                            control: (baseStyles) => ({
                                ...baseStyles,
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                color: '#333333',
                                border: '2px solid white'
                            }),
                            option: (baseStyles, state) => ({
                                ...baseStyles,
                                backgroundColor: state.isFocused ? '#007BFF' : '#f0f0f0',
                                color: state.isFocused ? 'white' : '#333333',
                                cursor: 'pointer'
                            }),
                            menu: (baseStyles) => ({
                                ...baseStyles,
                                backgroundColor: 'white'
                            }),
                            multiValue: (baseStyles) => ({
                                ...baseStyles,
                                backgroundColor: 'rgba(255, 255, 255, 0.9)'
                            }),
                            multiValueLabel: (baseStyles) => ({
                                ...baseStyles,
                                color: '#333333'
                            })
                        }}
                    />
                </label>
                <label>
                    Start Date:
                    {/* Date picker for start date */}
                    <input
                        type="date"
                        value={startDate}
                        onChange={handleStartDateChange}
                    />
                </label>
                <label>
                    End Date:
                    {/* Date picker for end date */}
                    <input
                        type="date"
                        value={endDate}
                        onChange={handleEndDateChange}
                    />
                </label>
                {/* Submit button */}
                <input type="submit" value="Submit" />
            </form>
            {/* Chart component to display price history */}
            <Chart data={filteredData} tickers={tickers} />
            {/* Table component to display company information */}
            <CompanySummaryTable data={summaryData} />
            {/* Show error message if there is one */}
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    );
}