const { protect } = require('./auth');

const adminAuth = async (req, res, next) => {
  // First run the regular protect middleware to get req.user
  await protect(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ success: false, message: 'Not authorized as an admin' });
    }
  });
};

module.exports = { adminAuth };
