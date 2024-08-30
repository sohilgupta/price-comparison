const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrapes product information from Myntra
 * @param {string} url - The Myntra product URL
 * @returns {Object} - The scraped product information
 */
async function myntraScraper(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const $ = cheerio.load(response.data);
    
    const title = $('.pdp-title').text().trim() || $('.pdp-name').text().trim();
    let price = $('.pdp-price strong').text().trim().replace('₹', '') || 
                $('.pdp-price').text().trim().replace('₹', '');
    price = price.replace(/[^0-9.]/g, '');
    const image = $('.image-grid-image:first').attr('src') || 
                  $('.image-grid-imageContainer:first img').attr('src');
    
    if (!title || !price || !image) {
      console.error('Failed to extract Myntra product information:', { title, price, image });
      throw new Error('Failed to extract product information');
    }
    
    return { title, price, image };
  } catch (error) {
    console.error('Myntra scraping error:', error);
    throw new Error('Failed to scrape Myntra data');
  }
}

module.exports = myntraScraper;