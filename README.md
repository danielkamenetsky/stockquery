# Stock Data Viewer

Stock Data Viewer is a web application that allows users to view stock price data and company information for selected ticker symbols.

## Features

- Search and select multiple stock ticker symbols.
- View stock price data in a line chart.
- View company information, such as market cap, EPS, PE ratio, and next earnings date.
- Filter stock price data based on a date range.

## Live Demo

The application is deployed on Vercel and can be accessed [here](<https://stockqueryapplication.vercel.app/>).

## Installation

1. Clone the repository
   ```bash
    git clone https://github.com/danielkamenetsky/stockquery.git


2. Navigate to the project directory

   ```bash
    cd <project-directory>

3. Navigate to the API folder:

   ```bash
    cd test-api



4. Install the dependencies
3. Navigate to the API folder:

   ```bash
    cd test-api



4. Install the dependencies
   ```bash
    npm install


5. Run the API
5. Run the API
   ```bash
    node server.js
    node server.js

6. Access the [stockquery application](<https://stockqueryapplication.vercel.app/>)
   ```bash
     Choose the tickers you'd like to compare. Data is available from Sept 1st 2024 to Oct 31, 2024. 


## Usage
1. Enter the stock ticker symbols in the search box and select from the dropdown.
2. Select the start date and end date for filtering the stock price data.
3. Click the "Submit" button to view the stock price chart and company information for the selected ticker symbols.

## Technologies Used
- Technologies Used
 -React.js
- Plotly.js
- D3.js
- react-select
- Vercel (for deployment)
