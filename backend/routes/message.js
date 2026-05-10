const express = require('express');
const router = express.Router();
const { 
  submitMessage, 
  getMessages, 
  markAsRead, 
  deleteMessage 
} = require('../controllers/messageController');
const { adminAuth } = require('../middleware/adminAuth');

router.post('/', submitMessage);
router.get('/', adminAuth, getMessages);
router.put('/:id/read', adminAuth, markAsRead);
router.delete('/:id', adminAuth, deleteMessage);

module.exports = router;
