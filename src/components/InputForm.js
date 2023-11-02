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

    // Fetch valid tickers when component mounts
    useEffect(() => {
        fetch(apiUrl)
            .then((res) => res.json())
            .then((data) => setValidTickers(data));
    }, [apiUrl]);

    // Fetch all data based on form inputs
    useEffect(() => {
        // Split tickers string into an array and trim whitespace
        // const tickerArray = tickers.split(',').map(t => t.trim()).filter(t => t !== '');
        const payload = {
            startDate,
            endDate,
            tickers,
        };
        // Make API request to fetch data
        fetch('https://interview-api-livid.vercel.app/api/get_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then((res) => res.json())
            .then((data) => {
                setAllData(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [startDate, endDate, tickers]);

    // Fetch summary data based on tickers input
    useEffect(() => {
        // Split tickers string into an array and trim whitespace
        // const tickerArray = tickers.split(',').map(t => t.trim()).filter(t => t !== '');
        fetch('https://interview-api-livid.vercel.app/api/get_summary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tickers,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setSummaryData(data);
            })
            .catch((error) => {
                console.error('Error fetching company summary data:', error);
                setSummaryData({ error: 'Failed to fetch company summary data.' });
            });
    }, [tickers]);

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


    // const handleDropdownChange = (selectedOptions) => {
    //     if (selectedOptions) {
    //         setTickers(selectedOptions.map(option => option.value));
    //     } else {
    //         setTickers([]);
    //     }
    // };


    function handleSubmit(event) {
        event.preventDefault();
        // Split tickers string into an array and trim whitespace
        // const tickerArray = tickers.split(',').map(t => t.trim()).filter(t => t !== '');
        // Validate tickers and filter data based on date range
        if (tickers.every(t => validTickers.includes(t))) {
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
                    {/* <input
                        type="text"
                        value={tickers}
                        onChange={handleTickersChange}
                        placeholder="Enter ticker symbols separated by commas"
                    /> */}
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