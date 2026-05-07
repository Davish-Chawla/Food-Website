const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.post('/', protect, placeOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrder);

module.exports = router;
