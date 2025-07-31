//C:\Users\Anza\Desktop\school3\school\server\controllers\teacherController.js
const Teacher = require('../models/Teacher');

// Create teacher
exports.createTeacher = async (req, res) => {
  try {
    const newTeacher = new Teacher(req.body);
    await newTeacher.save();
    res.status(201).json(newTeacher);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create teacher', details: err });
  }
};

// Upload timetable file for a Teacher
exports.uploadTimetable = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const timetableUrl = `/uploads/${req.file.filename}`;
    const updated = await Teacher.findByIdAndUpdate(
      req.params.id,
      { timetableUrl },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload timetable', details: err });
  }
};

// Get all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get teachers' });
  }
};

// Update teacher
exports.updateTeacher = async (req, res) => {
  try {
    const updated = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update teacher' });
  }
};

// Delete teacher
exports.deleteTeacher = async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: 'Teacher deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete teacher' });
  }
};
