import React from 'react';
import Plot from 'react-plotly.js';

export default function Chart(props) {
    console.log('Chart data:', props.data);

    if (!props.data || !Array.isArray(props.data)) {
        return <div>No data available</div>;
    }

    return props.data.map((chartData, index) => {
        const xValues = chartData.map(d => d.date);
        const yValues = chartData.map(d => d.price);

        const data = [{
            type: 'scatter',
            mode: 'lines',
            x: xValues,
            y: yValues,
            line: { shape: 'spline' }
        }];

        const layout = {
            title: `Stock Price for ${props.tickers[index]}`,
            xaxis: {
                title: 'Date',
                type: 'date'
            },
            yaxis: {
                title: 'Price'
            }
        };

        return (
            <Plot
                key={index}
                data={data}
                layout={layout}
                useResizeHandler={true}
                style={{ width: '100%', height: '100%' }}
            />
        );
    });
}
