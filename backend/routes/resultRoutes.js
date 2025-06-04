const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

router.get('/my-results', auth, (req, res) => {
  res.json({ message: 'Get user results' });
});

router.get('/:examId', auth, (req, res) => {
  res.json({ message: 'Get exam results' });
});

module.exports = router;