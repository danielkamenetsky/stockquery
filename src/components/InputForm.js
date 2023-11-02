
import React, { useState, useEffect } from 'react';
import Chart from './Chart';
import CompanySummaryTable from './CompanySummaryTable';

export default function InputForm() {
    const [ticker, setTicker] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [validTickers, setValidTickers] = useState([]);
    const [error, setError] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [allData, setAllData] = useState([]);
    const [summaryData, setSummaryData] = useState([]);


    const apiUrl = `https://interview-api-livid.vercel.app/api/tickers`;

    useEffect(() => {
        fetch(apiUrl)
            .then((res) => res.json())
            .then((data) => setValidTickers(data));
    }, [apiUrl]);

    useEffect(() => {
        const payload = {
            startDate,
            endDate,
            tickers: [ticker],
        };
        fetch('https://interview-api-livid.vercel.app/api/get_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then((res) => res.json())
            .then((data) => setAllData(data))
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [startDate, endDate, ticker]);

    useEffect(() => {
        fetch('https://interview-api-livid.vercel.app/api/get_summary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tickers: [ticker],
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data); // Log the company summary data to the console
                // Update the summaryData state with the fetched data
                setSummaryData(data);
            })
            .catch((error) => {
                console.error('Error fetching company summary data:', error);
                // Update the summaryData state with an error message
                setSummaryData({ error: 'Failed to fetch company summary data.' });
            });
    }, [ticker]);



    function handleTickerChange(event) {
        setTicker(event.target.value);
    }

    function handleStartDateChange(event) {
        setStartDate(event.target.value);
    }

    function handleEndDateChange(event) {
        setEndDate(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (validTickers.includes(ticker)) {
            const filtered = allData.filter(item =>
                item.symbol === ticker &&
                new Date(item.date) >= new Date(startDate) &&
                new Date(item.date) <= new Date(endDate)
            );
            setFilteredData(filtered);
            setError('');
        } else {
            setError('Invalid ticker symbol. Please enter a valid symbol.');
        }
    }
    return (
        <div className="App">
            <form onSubmit={handleSubmit}>
                <label>
                    Stock Ticker:
                    <input
                        type="text"
                        value={ticker}
                        onChange={handleTickerChange}
                        placeholder="Enter ticker symbol (in capital letters)"
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
            {/* Render the Chart component with filteredData */}
            <Chart data={filteredData} />
            <CompanySummaryTable data={summaryData} />
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    );
}