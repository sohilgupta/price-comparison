# Price Comparison App

This is a full-stack web application that allows users to compare prices of products across different e-commerce platforms.

## Features

- Input Amazon or Myntra product URLs
- Compare prices from Amazon, Myntra, Flipkart, and eBay
- Display product details and prices from various platforms
- Store query results in a MongoDB database

## Tech Stack

- Frontend: React
- Backend: Node.js with Express
- Database: MongoDB
- Web Scraping: Axios and Cheerio

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   cd client && npm install
   cd ../server && npm install
   ```
3. Start MongoDB locally
4. Start the server:
   ```
   cd server && npm run dev
   ```
5. Start the client:
   ```
   cd client && npm start
   ```
6. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Enter an Amazon or Myntra product URL in the input field
2. Click "Compare Prices"
3. View the price comparison results

## Note

This project uses web scraping for demonstration purposes. In a production environment, it's recommended to use official APIs when available to comply with the terms of service of e-commerce platforms.

## License

This project is open-source and available under the MIT License.