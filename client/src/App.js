import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ResultsSection from './components/ResultsSection';
import ErrorMessage from './components/ErrorMessage';
import LoadingSpinner from './components/LoadingSpinner';
import './styles.css';

/**
 * Main App component
 * Manages the state for results and errors, and handles form submission
 */
function App() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles form submission by sending a request to the server
   * @param {string} url - The product URL to compare prices for
   */
  const handleSubmit = async (url) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch data');
        setResults(data);
      } else {
        // If the response is not JSON, read it as text
        const text = await response.text();
        throw new Error(`Unexpected response from server: ${text.substring(0, 100)}...`);
      }
    } catch (err) {
      console.error('Error details:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Price Comparison App</h1>
      <InputForm onSubmit={handleSubmit} />
      {error && <ErrorMessage message={error} />}
      {isLoading && <LoadingSpinner />}
      {results && <ResultsSection results={results} />}
    </div>
  );
}

export default App;