const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = 5000;

// Enable CORS for all routes
app.use(cors());

// Connect to local MongoDB
mongoose.connect('mongodb://localhost:27017/price_comparison', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());

// API routes
app.use('/api', apiRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));