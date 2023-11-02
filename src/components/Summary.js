import React from 'react';

export default function CompanySummaryTable(summaryData) {
    return (
        <div>
            <h2>Company Summary</h2>
            <table>
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>EPS</th>
                        <th>Market Cap</th>
                        <th>Next Earnings Date</th>
                        <th>PE Ratio</th>
                        <th>Volume</th>
                    </tr>
                </thead>
                <tbody>
                    {summaryData.map((company) => (
                        <tr key={company.symbol}>
                            <td>{company.symbol}</td>
                            <td>{company.eps}</td>
                            <td>{company.marketCap}</td>
                            <td>{company.nextEarningsDate}</td>
                            <td>{company.peRatio}</td>
                            <td>{company.volume}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
