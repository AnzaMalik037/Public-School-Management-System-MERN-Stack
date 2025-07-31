//C:\Users\Anza\Desktop\school3\school\server\routes\teacherRoutes.js
const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const teacherController = require('../controllers/teacherController');
const multer = require('multer');
const path = require('path');

// Set up multer storage for uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// GET all teachers
router.get('/', teacherController.getAllTeachers);

// Create a teacher
router.post('/', teacherController.createTeacher);

// Upload timetable file for a teacher
router.post('/:id/upload-timetable', upload.single('timetable'), teacherController.uploadTimetable);

// Check name for login
router.post('/check-name', async (req, res) => {
  const { name } = req.body;
  const teacher = await Teacher.findOne({ name });
  if (teacher) return res.json({ exists: true });
  res.json({ exists: false });
});


// POST /api/teachers/login
router.post('/login', async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ msg: 'Name and password are required' });
  }

  try {
    const teacher = await Teacher.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } // case-insensitive match
    });

    if (!teacher || teacher.password !== password) {
      return res.status(401).json({ msg: 'Invalid name or password' });
    }

    res.json({ name: teacher.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});


// PATCH /api/teachers/:id - update teacher (e.g., password)
router.patch('/:id', async (req, res) => {
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedTeacher);
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ msg: 'Update failed.' });
  }
});


// Correct route path (just /byname)
router.get('/byname', async (req, res) => {
  const { name } = req.query;
  try {
    const teacher = await Teacher.findOne({ name });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json(teacher);
  } catch (err) {
    console.error("Error fetching teacher by name:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/:id', teacherController.updateTeacher);
router.delete('/:id', teacherController.deleteTeacher);
 
module.exports = router;
