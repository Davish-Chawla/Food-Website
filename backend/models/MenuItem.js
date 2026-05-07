const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
  veg: { type: Boolean, default: false },
  rating: { type: Number, default: 4.5 },
  prepTime: { type: String, default: "20 min" },
  bestseller: { type: Boolean, default: false },
  available: { type: Boolean, default: true },
  ordersCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
