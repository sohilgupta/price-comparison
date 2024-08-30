const mongoose = require('mongoose');

const PriceCheckSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  price: Number
});

/**
 * MongoDB schema for storing price comparison queries
 */
const QuerySchema = new mongoose.Schema({
  url: String,
  title: String,
  currentPrice: Number,
  priceChecks: [PriceCheckSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Query', QuerySchema);