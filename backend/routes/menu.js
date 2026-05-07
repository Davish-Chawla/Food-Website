const express = require('express');
const router = express.Router();
const { getMenuItems, getMenuItem, createMenuItem, updateMenuItem, deleteMenuItem, getCategories } = require('../controllers/menuController');
const { adminAuth } = require('../middleware/adminAuth');

router.get('/', getMenuItems);
router.get('/categories', getCategories);
router.get('/:id', getMenuItem);
router.post('/', adminAuth, createMenuItem);
router.put('/:id', adminAuth, updateMenuItem);
router.delete('/:id', adminAuth, deleteMenuItem);

module.exports = router;
