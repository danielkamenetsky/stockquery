import React, { useState, useEffect } from 'react';
import Chart from './Chart';
import CompanySummaryTable from './CompanySummaryTable';

export default function InputForm() {
    const [tickers, setTickers] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [validTickers, setValidTickers] = useState([]);
    const [error, setError] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [allData, setAllData] = useState([]);
    const [summaryData, setSummaryData] = useState([]);

    const apiUrl = 'https://interview-api-livid.vercel.app/api/tickers';

    useEffect(() => {
        fetch(apiUrl)
            .then((res) => res.json())
            .then((data) => setValidTickers(data));
    }, [apiUrl]);

    useEffect(() => {
        const tickerArray = tickers.split(',').map(t => t.trim()).filter(t => t !== '');
        const payload = {
            startDate,
            endDate,
            tickers: tickerArray,
        };
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

    useEffect(() => {
        const tickerArray = tickers.split(',').map(t => t.trim()).filter(t => t !== '');
        fetch('https://interview-api-livid.vercel.app/api/get_summary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tickers: tickerArray,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data); // Log the company summary data to the console
                setSummaryData(data);
            })
            .catch((error) => {
                console.error('Error fetching company summary data:', error);
                setSummaryData({ error: 'Failed to fetch company summary data.' });
            });
    }, [tickers]);

    function handleTickersChange(event) {
        setTickers(event.target.value);
    }

    function handleStartDateChange(event) {
        setStartDate(event.target.value);
    }

    function handleEndDateChange(event) {
        setEndDate(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        const tickerArray = tickers.split(',').map(t => t.trim()).filter(t => t !== '');
        if (tickerArray.every(t => validTickers.includes(t))) {
            const filtered = tickerArray.map(ticker =>
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

    return (
        <div className="App">
            <form onSubmit={handleSubmit}>
                <label>
                    Stock Ticker:
                    <input
                        type="text"
                        value={tickers}
                        onChange={handleTickersChange}
                        placeholder="Enter ticker symbols separated by commas"
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
            <Chart data={filteredData} tickers={tickers.split(',').map(t => t.trim()).filter(t => t !== '')} />
            <CompanySummaryTable data={summaryData} />
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    );
}