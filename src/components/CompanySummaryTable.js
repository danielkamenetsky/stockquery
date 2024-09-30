import React from 'react';
import '../styles/TableStyles.css';
import { formatMarketCap, formatVolume, formatDate } from '../components/utils/helpers';

export default function CompanySummaryTable({ data }) {
    if (!Array.isArray(data)) {
        return <div style={{ color: 'red' }}>{data.error}</div>;
    }

    return (
        <div>
            {data.map((company, index) => (
                <div key={index}>
                    <h2>Company Information for {company.symbol}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Symbol</th>
                                <th>Market Cap</th>
                                <th>EPS</th>
                                <th>PE Ratio</th>
                                <th>Volume</th>
                                <th>Next Earnings Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{company.symbol}</td>
                                <td>{formatMarketCap(company.marketCap)}</td>
                                <td>{company.eps}</td>
                                <td>{company.peRatio}</td>
                                <td>{formatVolume(company.volume)}</td>
                                <td>{formatDate(company.nextEarningsDate)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}



