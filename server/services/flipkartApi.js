const axios = require('axios');

/**
 * Mocks Flipkart API to fetch product price
 * @param {string} productName - The name of the product to search for
 * @returns {Object} - The mocked price data
 */
async function flipkartApi(productName) {
  // This is a mock function. In a real-world scenario, you would integrate with Flipkart's API
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock data
    return {
      price: (Math.random() * 100).toFixed(2),
    };
  } catch (error) {
    throw new Error('Failed to fetch Flipkart data');
  }
}

module.exports = flipkartApi;