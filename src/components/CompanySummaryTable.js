import React from 'react';
import '../components/ModernContainer.css';
import { formatMarketCap, formatVolume, formatDate, formatNumber } from '../components/utils/helpers';

export default function CompanySummaryTable({ data }) {
    if (!Array.isArray(data)) {
        return <div style={{ color: 'red' }}>{data.error}</div>;
    }

    return (
        <div className="company-info-container">
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
                            <td data-label="Symbol"><span>{company.symbol}</span></td>
                            <td data-label="Market Cap"><span>{formatMarketCap(company.marketCap)}</span></td>
                            <td data-label="EPS"><span>{formatNumber(company.eps)}</span></td>
                            <td data-label="PE Ratio"><span>{formatNumber(company.peRatio)}</span></td>
                            <td data-label="Volume"><span>{formatVolume(company.volume)}</span></td>
                            <td data-label="Next Earnings"><span>{formatDate(company.nextEarningsDate)}</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}
