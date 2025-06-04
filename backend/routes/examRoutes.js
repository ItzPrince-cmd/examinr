const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  res.json({ message: 'Get all exams' });
});

router.post('/', auth, authorize('teacher', 'admin'), (req, res) => {
  res.json({ message: 'Create exam' });
});

router.get('/:id', auth, (req, res) => {
  res.json({ message: 'Get exam by ID' });
});

router.put('/:id', auth, authorize('teacher', 'admin'), (req, res) => {
  res.json({ message: 'Update exam' });
});

router.delete('/:id', auth, authorize('teacher', 'admin'), (req, res) => {
  res.json({ message: 'Delete exam' });
});

module.exports = router;