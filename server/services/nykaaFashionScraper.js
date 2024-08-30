const axios = require('axios');
const cheerio = require('cheerio');

async function nykaaFashionScraper(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const $ = cheerio.load(response.data);
    
    const title = $('.product-title').text().trim();
    let price = $('.price').text().trim().replace('₹', '');
    price = price.replace(/[^0-9.]/g, '');
    const image = $('.product-image img').attr('src');
    
    if (!title || !price || !image) {
      console.error('Failed to extract Nykaa Fashion product information:', { title, price, image });
      throw new Error('Failed to extract product information');
    }
    
    return { title, price, image, url };
  } catch (error) {
    console.error('Nykaa Fashion scraping error:', error);
    throw new Error('Failed to scrape Nykaa Fashion data');
  }
}

module.exports = nykaaFashionScraper;