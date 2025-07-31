//C:\Users\Anza\Desktop\school\server\routes\adminRoutes.js
const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/adminController');
const { getAllTeachers } = require('../controllers/teacherController');



router.post('/login', loginAdmin);
router.get('/teachers', getAllTeachers);

module.exports = router;
