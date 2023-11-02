import React, { useState, useEffect } from 'react';
import Chart from './Chart';
import CompanySummaryTable from './CompanySummaryTable';
import '../styles/TableStyles.css';
import Select from 'react-select';


// Define the InputForm functional component
export default function InputForm() {
    // Define state variables for form inputs and fetched data
    const [tickers, setTickers] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [validTickers, setValidTickers] = useState([]);
    const [error, setError] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [allData, setAllData] = useState([]);
    const [summaryData, setSummaryData] = useState([]);
    const [selectedTickers, setSelectedTickers] = useState([]);

    const apiUrl = 'https://interview-api-livid.vercel.app/api/tickers';

    useEffect(() => {
        // Declare an asynchronous function to handle the API calls
        const fetchData = async () => {
            try {
                // Fetch the valid tickers from the API
                const validTickersResponse = await fetch(apiUrl);
                const validTickersData = await validTickersResponse.json();
                setValidTickers(validTickersData);

                // Prepare the payload for the next API call
                const payload = {
                    startDate,
                    endDate,
                    tickers,
                };
                // Fetch the all data based on the form inputs
                const allDataResponse = await fetch('https://interview-api-livid.vercel.app/api/get_data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // Convert the payload to a JSON string
                    body: JSON.stringify(payload),
                });
                // Parse the response as JSON
                const allDataData = await allDataResponse.json();
                setAllData(allDataData);

                // Fetch the summary data based on the tickers input
                const summaryDataResponse = await fetch('https://interview-api-livid.vercel.app/api/get_summary', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // Convert the payload to a JSON string
                    body: JSON.stringify({
                        tickers,
                    }),
                });
                const summaryDataData = await summaryDataResponse.json();
                setSummaryData(summaryDataData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Call the fetchData function
        fetchData();
    }, [apiUrl, startDate, endDate, tickers]);



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

    // Convert validTickers to the format required by react-select
    const tickerOptions = validTickers
        .filter(ticker => !tickers.includes(ticker)) // Exclude selected tickers
        .map(ticker => ({ value: ticker, label: ticker }));


    function handleSubmit(event) {
        event.preventDefault();
        // Validate tickers and filter data based on date range
        if (tickers.every(t => validTickers.includes(t))) {
            // Create an array of filtered data for each selected ticker symbol within the specified date range
            const filtered = tickers.map(ticker =>
                allData.filter(item =>
                    item.symbol === ticker &&
                    new Date(item.date) >= new Date(startDate) &&
                    new Date(item.date) <= new Date(endDate)
                )
            );
            setFilteredData(filtered);
            setError('');
        } else {
            setError('Invalid ticker symbol. Please enter valid symbols separated by commas.');
        }
    }

    // Render the form and fetched data
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
            {/* Chart component to display stock price data */}
            <Chart data={filteredData} tickers={tickers} />
            {/* CompanySummaryTable component to display company summary data */}
            <CompanySummaryTable data={summaryData} />
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    );
}