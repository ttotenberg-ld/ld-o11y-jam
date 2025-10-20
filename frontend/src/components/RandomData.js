import React, { useState } from 'react';
import './RandomData.css';

const RandomData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRandomData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/random-data');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching random data:', err);
      throw err; // Re-throw to let ErrorBoundary catch it
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="random-data">
      <h2>Random Data Generator</h2>
      <button
        onClick={fetchRandomData}
        disabled={loading}
        className="generate-button"
      >
        {loading ? 'Generating...' : 'Generate Random Data'}
      </button>

      {data && (
        <div className="data-display">
          <div className="data-item">
            <span className="data-label">Value:</span>
            <span className="data-value">{data.value}</span>
          </div>
          <div className="data-item">
            <span className="data-label">Message:</span>
            <span className="data-value">{data.message}</span>
          </div>
          <div className="data-item">
            <span className="data-label">Timestamp:</span>
            <span className="data-value">
              {new Date(data.timestamp * 1000).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RandomData;
