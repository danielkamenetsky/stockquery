import React from 'react';

export default function CompanySummaryTable({ data }) {
    if (!Array.isArray(data)) {
        return <div style={{ color: 'red' }}>{data.error}</div>;
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>Symbol</th>
                    <th>Market Cap</th>
                    <th>Revenue</th>
                    <th>EPS</th>
                    <th>PE Ratio</th>
                    <th>Volume</th>
                    <th>Next Earnings Date</th>
                </tr>
            </thead>
            <tbody>
                {data.map((company, index) => (
                    <tr key={index}>
                        <td>{company.symbol}</td>
                        <td>{company.marketCap}</td>
                        <td>{company.revenue}</td>
                        <td>{company.eps}</td>
                        <td>{company.peRatio}</td>
                        <td>{company.volume}</td>
                        <td>{company.nextEarningsDate}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
