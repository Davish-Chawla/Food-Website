const express = require('express');
const router = express.Router();
const { register, login, getMe, checkEmail, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/check-email', checkEmail);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);

module.exports = router;
