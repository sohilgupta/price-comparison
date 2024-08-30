import React, { useState } from 'react';

/**
 * InputForm component
 * Renders a form for users to input product URLs
 * @param {Object} props - Component props
 * @param {function} props.onSubmit - Function to handle form submission
 */
function InputForm({ onSubmit }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter Amazon or Myntra product URL"
        required
      />
      <button type="submit">Compare Prices</button>
    </form>
  );
}

export default InputForm;