//C:\Users\Anza\Desktop\school3\school\server\routes\studentRoutes.js
const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const studentController = require('../controllers/studentController');

// POST route for creating students
router.post('/', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).send(student);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/', studentController.getAllStudents);
router.get('/byname', studentController.getStudentByName);


router.post('/check-name', async (req, res) => {
  const { name } = req.body;
  const student = await Student.findOne({ name });
  if (student) return res.json({ exists: true });
  res.json({ exists: false });
});

// POST /api/students/login
router.post('/login', async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ msg: 'Name and password are required' });
  }

  try {
    const student = await Student.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } // case-insensitive exact match
    });

    if (!student || student.password !== password) {
      return res.status(401).json({ msg: 'Invalid name or password' });
    }

    // ✅ Modify this line to return both _id and name
    res.json({
      _id: student._id,
      name: student.name
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});


//to update a student's details by ID
router.patch('/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ msg: 'Update failed.' });
  }
});


router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;