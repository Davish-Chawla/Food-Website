const express = require('express');
const router = express.Router();
const { getDashboardStats, getOrders, updateOrderStatus, getCustomers, getMenu } = require('../controllers/adminController');
const { adminAuth } = require('../middleware/adminAuth');

router.use(adminAuth);

router.get('/dashboard', getDashboardStats);
router.get('/orders', getOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/customers', getCustomers);
router.get('/menu', getMenu);

module.exports = router;
