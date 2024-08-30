const axios = require('axios');

/**
 * Mocks eBay API to fetch product price
 * @param {string} productName - The name of the product to search for
 * @returns {Object} - The mocked price data
 */
async function ebayApi(productName) {
  // This is a mock function. In a real-world scenario, you would integrate with eBay's API
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock data
    return {
      price: (Math.random() * 100).toFixed(2),
    };
  } catch (error) {
    throw new Error('Failed to fetch eBay data');
  }
}

module.exports = ebayApi;