import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

function ResultsSection({ results }) {
  const [alertPrice, setAlertPrice] = useState('');
  const [alertEmail, setAlertEmail] = useState('');

  const formatPrice = (price) => {
    return price ? `₹${parseFloat(price).toFixed(2)}` : 'N/A';
  };

  const chartData = {
    labels: results.priceHistory.map(p => new Date(p.date)),
    datasets: [
      {
        label: 'Price History',
        data: results.priceHistory.map(p => ({ x: new Date(p.date), y: p.price })),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Price History'
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day'
        },
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Price (₹)'
        }
      }
    }
  };

  const renderPriceItem = (source, price, url) => (
    <li className="price-item">
      <span className="price-source">{source}</span>
      <span className="price-value">
        {formatPrice(price)}
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="product-link">
            View Product
          </a>
        )}
      </span>
    </li>
  );

  const handleSetAlert = (e) => {
    e.preventDefault();
    // TODO: Implement server-side alert functionality
    alert(`Alert set for ₹${alertPrice}. We'll notify you at ${alertEmail}`);
  };

  return (
    <div className="results">
      <div className="product-info">
        <img src={results.image} alt={results.title} />
        <div className="product-details">
          <h2>{results.title}</h2>
          <p><strong>Brand:</strong> {results.brand || 'N/A'}</p>
          <p><strong>Category:</strong> {results.category || 'N/A'}</p>
          <p><strong>Rating:</strong> {results.rating || 'N/A'}</p>
        </div>
      </div>
      <div className="price-comparison">
        <h3>Price Comparison</h3>
        <ul className="price-list">
          {renderPriceItem(results.source, results.sourcePrice, results.sourceUrl)}
          {renderPriceItem('Amazon', results.amazonPrice, results.amazonUrl)}
          {renderPriceItem('Myntra', results.myntraPrice, results.myntraUrl)}
          {renderPriceItem('Tata CLiQ', results.tataCliqPrice, results.tataCliqUrl)}
          {renderPriceItem('Nykaa Fashion', results.nykaaFashionPrice, results.nykaaFashionUrl)}
          {renderPriceItem('AJIO', results.ajioPrice, results.ajioUrl)}
        </ul>
      </div>
      <div className="price-history">
        <h3>Price History</h3>
        <div className="price-extremes">
          <div className="price-extreme">
            <div className="price-extreme-label">Highest price</div>
            <div className="price-extreme-value">{formatPrice(results.maxPrice)}</div>
          </div>
          <div className="price-extreme">
            <div className="price-extreme-label">Lowest price</div>
            <div className="price-extreme-value">{formatPrice(results.minPrice)}</div>
          </div>
        </div>
        <div style={{ width: '100%', height: '300px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
      <div className="price-alert">
        <h3>Set Price Alert</h3>
        <form onSubmit={handleSetAlert}>
          <input
            type="number"
            placeholder="Alert Price"
            value={alertPrice}
            onChange={(e) => setAlertPrice(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={alertEmail}
            onChange={(e) => setAlertEmail(e.target.value)}
            required
          />
          <button type="submit">Set Alert</button>
        </form>
      </div>
    </div>
  );
}

export default ResultsSection;