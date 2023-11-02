import React from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3-scale-chromatic';

// Define the Chart functional component that takes props as its argument
export default function Chart(props) {
    console.log('Chart data:', props.data);

    // Check if the data prop is not provided or is not an array
    if (!props.data || !Array.isArray(props.data)) {
        return <div>No data available</div>;
    }

    // Map over the data prop to create a trace for each set of data
    const traces = props.data.map((chartData, index) => {
        // Extract the x and y values from the chartData array
        const xValues = chartData.map(d => d.date);
        const yValues = chartData.map(d => d.price);

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
        title: 'Stock Price Data',
        xaxis: {
            title: 'Date',
            type: 'date'
        },
        yaxis: {
            title: 'Price'
        }
    };

    // Return the Plot component with the specified data, layout, and styles
    return (
        <Plot
            data={traces}
            layout={layout}
            useResizeHandler={true}
            style={{ width: '100%', height: '100%' }}
        />
    );
}
