const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  res.json({ message: 'Get questions' });
});

router.post('/', auth, authorize('teacher', 'admin'), (req, res) => {
  res.json({ message: 'Create question' });
});

module.exports = router;