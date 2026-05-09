const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const MenuItem = require('./models/MenuItem');

// Load env vars — use __dirname so this works whether called directly or via api/index.js
dotenv.config({ path: path.resolve(__dirname, '.env') });


const app = express();

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Enable CORS
app.use(cors());

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  try {
    await connectDB();
    
    // Auto-seed admin if it doesn't exist
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
      if (!adminExists) {
        console.log('Seeding admin user...');
        await User.create({
          name: 'System Admin',
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
          role: 'admin'
        });
        console.log('Admin user created successfully');
      }
    }

    // Auto-seed Menu Items if empty
    const menuCount = await MenuItem.countDocuments();
    if (menuCount === 0) {
      console.log('Seeding menu items...');
      const foodItems = [
        { name: "Margherita Pizza", description: "Classic tomato sauce, fresh mozzarella, and basil", price: 299, category: "Pizza", veg: true, rating: 4.8, bestseller: true, image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&q=80" },
        { name: "Pepperoni Feast", description: "Loaded with spicy pepperoni and extra cheese", price: 399, category: "Pizza", veg: false, rating: 4.7, bestseller: true, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80" },
        { name: "Veggie Supreme", description: "Bell peppers, onions, mushrooms, olives, and corn", price: 349, category: "Pizza", veg: true, rating: 4.5, image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500&q=80" },
        { name: "Classic Cheese Burger", description: "Juicy veg patty with melted cheddar and secret sauce", price: 199, category: "Burgers", veg: true, rating: 4.6, bestseller: true, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80" },
        { name: "Crispy Chicken Burger", description: "Fried chicken breast with coleslaw and pickles", price: 249, category: "Burgers", veg: false, rating: 4.8, bestseller: true, image: "https://images.unsplash.com/photo-1513185158878-8d8c1827003f?w=500&q=80" },
        { name: "Butter Chicken", description: "Tender chicken in a rich, creamy tomato gravy", price: 449, category: "Indian", veg: false, rating: 4.9, bestseller: true, image: "https://images.unsplash.com/photo-1603894584134-f132f1782bb5?w=500&q=80" },
        { name: "Dal Makhani", description: "Slow-cooked black lentils with cream and butter", price: 329, category: "Indian", veg: true, rating: 4.7, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80" },
        { name: "Paneer Tikka Masala", description: "Grilled paneer in a spicy onion-tomato gravy", price: 389, category: "Indian", veg: true, rating: 4.6, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&q=80" },
        { name: "Chicken Biryani", description: "Fragrant basmati rice with spiced chicken and herbs", price: 349, category: "Indian", veg: false, rating: 4.9, bestseller: true, image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=500&q=80" },
        { name: "Garlic Naan", description: "Soft clay-oven bread with garlic and butter", price: 69, category: "Indian", veg: true, rating: 4.8, image: "https://images.unsplash.com/photo-1601050690597-df056fb01793?w=500&q=80" },
        { name: "Pasta Alfredo", description: "Penne in a creamy white parmesan sauce", price: 329, category: "Pasta", veg: true, rating: 4.5, image: "https://images.unsplash.com/photo-1645112481338-3566113b2e53?w=500&q=80" },
        { name: "Chicken Arrabbiata", description: "Pasta in a spicy red tomato sauce with chicken", price: 369, category: "Pasta", veg: false, rating: 4.4, image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500&q=80" },
        { name: "Caesar Salad", description: "Fresh lettuce with croutons, parmesan and dressing", price: 249, category: "Salads", veg: true, rating: 4.3, image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&q=80" },
        { name: "Greek Salad", description: "Cucumbers, tomatoes, olives and feta cheese", price: 279, category: "Salads", veg: true, rating: 4.2, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&q=80" },
        { name: "Chocolate Lava Cake", description: "Warm chocolate cake with a gooey center", price: 179, category: "Desserts", veg: true, rating: 4.9, bestseller: true, image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500&q=80" },
        { name: "Tiramisu", description: "Classic Italian coffee-flavored dessert", price: 229, category: "Desserts", veg: true, rating: 4.8, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&q=80" },
        { name: "Mango Lassi", description: "Refreshing yogurt-based mango drink", price: 129, category: "Beverages", veg: true, rating: 4.7, image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=500&q=80" },
        { name: "Fresh Lime Soda", description: "Classic refreshing lemon and soda drink", price: 89, category: "Beverages", veg: true, rating: 4.5, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80" },
        { name: "French Fries", description: "Crispy salted golden potato fries", price: 129, category: "Sides", veg: true, rating: 4.6, image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500&q=80" },
        { name: "Veg Spring Rolls", description: "Crispy rolls stuffed with seasoned vegetables", price: 189, category: "Sides", veg: true, rating: 4.4, image: "https://images.unsplash.com/photo-1606331132800-473994c24ee2?w=500&q=80" },
        { name: "Chicken Hakka Noodles", description: "Stir-fried noodles with chicken and veggies", price: 279, category: "Chinese", veg: false, rating: 4.6, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&q=80" },
        { name: "Veg Manchurian", description: "Vegetable balls in a spicy soy-based gravy", price: 249, category: "Chinese", veg: true, rating: 4.5, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80" },
        { name: "Club Sandwich", description: "Triple-layered veg sandwich with fries", price: 229, category: "Sandwiches", veg: true, rating: 4.4, image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&q=80" },
        { name: "Grilled Chicken Sandwich", description: "Grilled chicken with lettuce and mayo", price: 259, category: "Sandwiches", veg: false, rating: 4.6, image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=500&q=80" },
        { name: "Red Velvet Pastry", description: "Soft red velvet sponge with cream cheese", price: 149, category: "Desserts", veg: true, rating: 4.7, image: "https://images.unsplash.com/photo-1586788680434-30d3246814c7?w=500&q=80" }
      ];
      await MenuItem.insertMany(foodItems);
      console.log('25 menu items seeded successfully');
    }
    
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database connection error', error: error.message });
  }
});

// Root route for health check
app.get(['/', '/api'], async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    const readyStateMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    res.json({ 
      success: true,
      message: 'Foodie API is running...', 
      database: dbStatus,
      readyState: readyStateMap[mongoose.connection.readyState] || 'unknown',
      env: {
        has_mongo_uri: !!process.env.MONGO_URI,
        mongo_uri_prefix: process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 30) + '...' : 'NOT SET',
        node_env: process.env.NODE_ENV
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Route files
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

// Mount routers
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/menu', '/menu'], menuRoutes);
app.use(['/api/orders', '/orders'], orderRoutes);
app.use(['/api/admin', '/admin'], adminRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;

// Only listen if not running on Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
