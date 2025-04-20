const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/auth');

// Example POST route to submit a checklist
router.post('/submit', authMiddleware, (req, res) => {
  const { title, status } = req.body;

  // You would usually save to MongoDB here.
  console.log('Checklist submitted:', { title, status });

  res.status(200).json({ message: 'Checklist submitted successfully' });
});

module.exports = router;
