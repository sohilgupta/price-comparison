const axios = require('axios');
const cheerio = require('cheerio');

async function ajioScraper(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const $ = cheerio.load(response.data);
    
    const title = $('.prod-name').text().trim();
    let price = $('.prod-sp').text().trim().replace('₹', '');
    price = price.replace(/[^0-9.]/g, '');
    const image = $('.img-blk img').attr('src');
    
    if (!title || !price || !image) {
      console.error('Failed to extract AJIO product information:', { title, price, image });
      throw new Error('Failed to extract product information');
    }
    
    return { title, price, image, url };
  } catch (error) {
    console.error('AJIO scraping error:', error);
    throw new Error('Failed to scrape AJIO data');
  }
}

module.exports = ajioScraper;