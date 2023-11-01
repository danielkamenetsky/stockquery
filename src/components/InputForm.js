import React, { useState, useEffect } from 'react'


export default function InputForm() {
    const [ticker, setTicker] = useState('');
    // validinput = ['ABCDEFGHIJKLMNO....]
    const apiUrl = `https://interview-api-livid.vercel.app/api/tickers`
    useEffect(() => {
        fetch(apiUrl)
            .then((res) => res.json())
            .then((data) => console.log(data));
    }, []);

    function handleTickerChange(event) {
        setTicker(event.target.value);
    }

    return (
        <div className="App">
            <form>
                <label>
                    Stock Ticker:
                    <input
                        type="text"
                        value={ticker}
                        onChange={handleTickerChange}
                        placeholder="Enter ticker symbol (in capital letters)"
                    />
                </label>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}

