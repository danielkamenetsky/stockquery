import React from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3-scale-chromatic';

export default function Chart(props) {
    if (!props.data || !Array.isArray(props.data)) {
        return <div>No data available</div>;
    }

    // Create normalized traces based on percentage change from first day
    const traces = props.data.map((chartData, index) => {
        // Get the base price (first day's price)
        const basePrice = chartData[0]?.price;

        // Calculate percentage change for each day
        const xValues = chartData.map(d => new Date(d.date));
        const yValues = chartData.map(d => {
            const pctChange = ((d.price - basePrice) / basePrice) * 100;
            console.log(`${d.date}: ${d.price} -> ${pctChange}%`);
            return pctChange;
        });
        return {
            type: 'scatter',
            mode: 'lines',
            name: props.tickers[index],
            x: xValues,
            y: yValues,
            line: { color: d3.schemeTableau10[index % 10] }
        };
    });

    const layout = {
        title: 'Stock Price Performance Comparison',
        xaxis: {
            title: 'Date',
            type: 'date'
        },
        yaxis: {
            title: 'Percentage Change (%)',
            zeroline: true,
            zerolinecolor: '#969696',
            zerolinewidth: 1,
            gridcolor: '#e6e6e6',
            // ADDED: These lines will force it to show a good range of positive and negative
            autorange: false,  // Don't auto-range
            range: [-100, 100],  // Show from -10% to +10% by default
        },
        hovermode: 'x unified',
        hoverlabel: { namelength: -1 },
        showlegend: true,
        legend: {
            x: 1,
            xanchor: 'right',
            y: 1
        }
    };
    return (
        <Plot
            data={traces}
            layout={layout}
            useResizeHandler={true}
            style={{ width: '100%', height: '100%' }}
        />
    );
}