//C:\Users\Anza\Desktop\school3\school\server\routes\resultRoutes.js
const express = require('express');
const router = express.Router();
const { createResult, getAllResults, updateResult, deleteResult
} = require('../controllers/resultController');
const Result = require('../models/Result'); // <-- Add this

// Existing routes
router.post('/add', createResult);
router.get('/', getAllResults);
router.patch('/:id', updateResult);
router.delete('/:id', deleteResult);

module.exports = router;