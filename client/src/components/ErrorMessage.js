import React from 'react';

/**
 * ErrorMessage component
 * Displays error messages
 * @param {Object} props - Component props
 * @param {string} props.message - The error message to display
 */
function ErrorMessage({ message }) {
  return <div className="error">{message}</div>;
}

export default ErrorMessage;