import React from 'react';
import Plot from 'react-plotly.js';

export default function Chart(props) {
    console.log('Chart data:', props.data);
    console.log("hello why is above not working")

    const xValues = props.data ? props.data.map(d => d.date) : [];
    const yValues = props.data ? props.data.map(d => d.price) : [];

    const data = [{
        type: 'scatter',
        mode: 'lines',
        x: xValues,
        y: yValues,
        line: { shape: 'spline' }
    }];

    const layout = {
        title: 'Stock Price',
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
            data={data}
            layout={layout}
            useResizeHandler={true}
            style={{ width: '100%', height: '100%' }}
        />
    );
}
