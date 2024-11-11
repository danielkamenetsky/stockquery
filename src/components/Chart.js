// Chart.js
import React from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3-scale-chromatic';

export default function Chart(props) {
    if (!props.data || !Array.isArray(props.data)) {
        return <div>No data available</div>;
    }

    // Define a set of bright, distinct colors for tickers
    const tickerColors = [
        '#2962FF',  // Bright blue
        '#00B8D4',  // Cyan
        '#00E676',  // Bright green
        '#FFAB00',  // Amber
        '#FF6D00',  // Orange
        '#FF1744',  // Red
        '#D500F9',  // Purple
        '#00E5FF',  // Light blue
        '#76FF03',  // Light green
        '#FFC400',  // Yellow
    ];

    const traces = props.data.map((chartData, index) => {
        const basePrice = chartData[0]?.price;
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
            line: {
                color: tickerColors[index % tickerColors.length],  // Cycle through colors
                width: 3  // Made lines thicker
            }
        };
    });

    const layout = {
        plot_bgcolor: '#131722',
        paper_bgcolor: '#131722',
        title: {
            text: 'Stock Price Performance Comparison',
            font: {
                color: '#D1D4DC',
                size: 16
            }
        },
        xaxis: {
            title: 'Date',
            type: 'date',
            gridcolor: '#1f2937',
            linecolor: '#2A2E39',
            tickfont: { color: '#D1D4DC' },
            titlefont: { color: '#D1D4DC' }
        },
        yaxis: {
            title: 'Percentage Change (%)',
            zeroline: true,
            zerolinecolor: '#2A2E39',
            zerolinewidth: 1,
            gridcolor: '#1f2937',
            linecolor: '#2A2E39',
            tickfont: { color: '#D1D4DC' },
            titlefont: { color: '#D1D4DC' },
            autorange: false,
            range: [-20, 20],
        },
        hovermode: 'x unified',
        hoverlabel: {
            namelength: -1,
            bgcolor: '#1f2937',
            font: { color: '#D1D4DC' }
        },
        showlegend: true,
        legend: {
            x: 1,
            xanchor: 'right',
            y: 1,
            font: { color: '#D1D4DC' },
            bgcolor: 'rgba(19, 23, 34, 0.7)',
            bordercolor: '#2A2E39'
        },
        margin: {
            l: 50,
            r: 50,
            t: 50,
            b: 50
        }
    };

    return (
        <div style={{
            backgroundColor: '#131722',
            padding: '20px',
            borderRadius: '4px',
            border: '1px solid #2A2E39'
        }}>
            <Plot
                data={traces}
                layout={layout}
                useResizeHandler={true}
                style={{ width: '100%', height: '600px' }}
                config={{
                    displayModeBar: true,
                    displaylogo: false,
                    scrollZoom: true,  // Enable scroll to zoom
                }}
            />
        </div>
    );
}