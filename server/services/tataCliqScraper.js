const axios = require('axios');
const cheerio = require('cheerio');

async function tataCliqScraper(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const $ = cheerio.load(response.data);
    
    const title = $('.pdp-title').text().trim();
    let price = $('.price-text').text().trim().replace('₹', '');
    price = price.replace(/[^0-9.]/g, '');
    const image = $('.pdp-image img').attr('src');
    
    if (!title || !price || !image) {
      console.error('Failed to extract Tata CLiQ product information:', { title, price, image });
      throw new Error('Failed to extract product information');
    }
    
    return { title, price, image, url };
  } catch (error) {
    console.error('Tata CLiQ scraping error:', error);
    throw new Error('Failed to scrape Tata CLiQ data');
  }
}

module.exports = tataCliqScraper;