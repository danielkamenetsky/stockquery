import React, { useState, useEffect } from 'react';
import Chart from './Chart';

export default function InputForm() {
    const [ticker, setTicker] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [validTickers, setValidTickers] = useState([]);
    const [error, setError] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [allData, setAllData] = useState([]);

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
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    );
}

// //
// Goal: Create a stock querying app.

// More detail: The user will land on a page, and they’ll have some inputs in front of them.Your goal is to query the api for what the user wants to see.You will display a chart(use any charting library you like) and a table summarizing the company information.

// Below are the api routes you have available along with example payloads.Base URL to be provided during the interview.

// End point api / tickers GET

// End point: /api/get_data POST
// User inputs: startdate, enddate, tickers
// Example payload:

// {
//     "startDate": "2023-10-01",
//         "endDate": "2023-10-11",
//             "tickers": ["APPL", "GOOG"]
// }

// Example payload:
// End point: /api/get_summary POST
// {
//     "tickers": ["APPL", "GOOG"]
// }

// Link https://interview-api-livid.vercel.app by Felix Izraitel
// Felix Izraitel
// 3: 17 p.m.
//     https://interview-api-livid.vercel.app/
// useEffect(() => { fetch(url).the...by Art Hanson
// Art Hanson
// 3: 42 p.m.
//     useEffect(() => {
//         fetch(url)
//             .then((res) => res.json())
//             .then((data) => console.log(data));
//     }, []);


// use form apiUrl
// efficeint
// cleanup
// leave comments
// // codepen

// usestate 
// live url for it
