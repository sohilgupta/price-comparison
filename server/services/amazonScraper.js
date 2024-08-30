const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrapes product information from Amazon
 * @param {string} url - The Amazon product URL
 * @returns {Object} - The scraped product information
 */
async function amazonScraper(url) {
  try {
    // Handle shortened Amazon URLs
    if (url.includes('amzn.in')) {
      const response = await axios.get(url, {
        maxRedirects: 0,
        validateStatus: (status) => status >= 200 && status < 400,
      });
      if (response.headers.location) {
        url = response.headers.location;
      }
    }

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const $ = cheerio.load(response.data);
    
    const title = $('#productTitle').text().trim();
    let price = $('.a-price-whole').first().text().trim();
    if (!price) {
      price = $('#priceblock_ourprice').text().trim();
    }
    if (!price) {
      price = $('#priceblock_dealprice').text().trim();
    }
    price = price.replace(/[^0-9.]/g, '');
    const image = $('#landingImage').attr('src') || $('.a-dynamic-image').first().attr('src');
    
    if (!title || !price || !image) {
      throw new Error('Failed to extract product information');
    }
    
    return { title, price, image };
  } catch (error) {
    console.error('Amazon scraping error:', error);
    throw new Error('Failed to scrape Amazon data');
  }
}

module.exports = amazonScraper;