const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

// Get all food items
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Seed food items (for initial setup)
router.post('/seed', async (req, res) => {
  try {
    await Food.deleteMany(); // Clear existing
    const foods = await Food.insertMany(req.body);
    res.status(201).json(foods);
  } catch (err) {
    console.error('Seeding error:', err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
