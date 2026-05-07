const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
  category: { type: String },
  veg: { type: Boolean, default: true },
  rating: { type: Number, default: 4.5 },
  bestseller: { type: Boolean, default: false },
  prepTime: { type: String, default: '25 min' }
});

module.exports = mongoose.model('Food', foodSchema);
