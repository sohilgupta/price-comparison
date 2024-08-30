const express = require('express');
const router = express.Router();
const Query = require('../models/Query');
const amazonScraper = require('../services/amazonScraper');
const myntraScraper = require('../services/myntraScraper');
const tataCliqScraper = require('../services/tataCliqScraper');
const nykaaFashionScraper = require('../services/nykaaFashionScraper');
const ajioScraper = require('../services/ajioScraper');
const axios = require('axios');
const cheerio = require('cheerio');
const tf = require('@tensorflow/tfjs-node');
const mobilenet = require('@tensorflow-models/mobilenet');
const natural = require('natural');
const TfIdf = natural.TfIdf;

let model;

// Function to load the MobileNet model
async function loadModel() {
  model = await mobilenet.load();
  console.log('MobileNet model loaded');
}

// Load the model when the server starts
loadModel().catch(console.error);

// Function to generate search URLs
function generateSearchUrl(platform, query) {
  const encodedQuery = encodeURIComponent(query);
  switch (platform) {
    case 'Amazon':
      return `https://www.amazon.in/s?k=${encodedQuery}`;
    case 'Myntra':
      return `https://www.myntra.com/${encodedQuery}`;
    case 'Tata CLiQ':
      return `https://www.tatacliq.com/search/?searchCategory=all&text=${encodedQuery}`;
    case 'Nykaa Fashion':
      return `https://www.nykaafashion.com/search?q=${encodedQuery}`;
    case 'AJIO':
      return `https://www.ajio.com/search/?text=${encodedQuery}`;
    default:
      return null;
  }
}

// Function to find the exact product on a given platform
const findExactProduct = async (platform, sourceProduct) => {
  const searchUrl = generateSearchUrl(platform, `${sourceProduct.brand} ${sourceProduct.title}`);
  try {
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    // Implement platform-specific scraping logic here
    // For now, we'll return a mock result
    return {
      url: searchUrl,
      price: (Math.random() * 100 + 50).toFixed(2) // Random price between 50 and 150
    };
  } catch (error) {
    console.error(`Error searching on ${platform}:`, error.message);
    return { url: searchUrl, price: null };
  }
};

router.post('/compare', async (req, res) => {
  try {
    const { url } = req.body;
    let sourceData, source, sourceUrl;

    // Determine the source of the URL and scrape data
    if (url.includes('amazon') || url.includes('amzn.in')) {
      sourceData = await amazonScraper(url);
      source = 'Amazon';
    } else if (url.includes('myntra')) {
      sourceData = await myntraScraper(url);
      source = 'Myntra';
    } else if (url.includes('tatacliq')) {
      sourceData = await tataCliqScraper(url);
      source = 'Tata CLiQ';
    } else if (url.includes('nykaa')) {
      sourceData = await nykaaFashionScraper(url);
      source = 'Nykaa Fashion';
    } else if (url.includes('ajio')) {
      sourceData = await ajioScraper(url);
      source = 'AJIO';
    } else {
      throw new Error(`Unsupported URL: ${url}. Please provide a supported e-commerce URL.`);
    }
    sourceUrl = url;

    // Find the product on other platforms
    const platforms = ['Amazon', 'Myntra', 'Tata CLiQ', 'Nykaa Fashion', 'AJIO'];
    const productSearchPromises = platforms
      .filter(platform => platform !== source)
      .map(platform => findExactProduct(platform, sourceData));

    const productSearchResults = await Promise.all(productSearchPromises);

    // Compile results
    const results = {
      title: sourceData.title,
      image: sourceData.image,
      brand: sourceData.brand || 'N/A',
      category: sourceData.category || 'N/A',
      rating: sourceData.rating || 'N/A',
      source,
      sourceUrl,
      sourcePrice: parseFloat(sourceData.price),
    };

    platforms.forEach((platform, index) => {
      if (platform !== source) {
        const searchResult = productSearchResults[index - 1]; // -1 because we filtered out the source platform
        results[`${platform.toLowerCase()}Price`] = searchResult.price ? parseFloat(searchResult.price) : null;
        results[`${platform.toLowerCase()}Url`] = searchResult.url;
      }
    });

    // Generate price history (mock data for demonstration)
    const priceHistory = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      price: results.sourcePrice * (0.9 + Math.random() * 0.2)
    }));

    const maxPrice = Math.max(...priceHistory.map(p => p.price));
    const minPrice = Math.min(...priceHistory.map(p => p.price));

    res.json({
      ...results,
      priceHistory,
      maxPrice,
      minPrice
    });
  } catch (error) {
    console.error('Detailed error in /api/compare:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

module.exports = router;