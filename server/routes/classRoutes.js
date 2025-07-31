// C:\Users\Anza\Desktop\school3\school\server\routes\classRoutes.js
const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const Class = require('../models/Class'); // ✅ ADD THIS
const multer = require('multer');
const path = require('path');

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Timetable upload route
router.post('/:id/upload-timetable', upload.single('timetable'), classController.uploadTimetable);

// Route to get class by classId and section
router.get('/byclassid/:id', async (req, res) => {
  try {
    const classId = parseInt(req.params.id);
    const section = req.query.section;

    const foundClass = await Class.findOne({ classId, classSection: section });

    if (!foundClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json(foundClass);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching class', error });
  }
});

// CRUD routes
router.post('/', classController.createClass);
router.get('/', classController.getAllClasses);
router.put('/:id', classController.updateClass);
router.delete('/:id', classController.deleteClass);

module.exports = router;
