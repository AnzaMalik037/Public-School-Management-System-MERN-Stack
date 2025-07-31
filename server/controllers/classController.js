//C:\Users\Anza\Desktop\school3\school\server\controllers\classController.js
const Class = require('../models/Class');

// Create Class
exports.createClass = async (req, res) => {
  try {
    const newClass = new Class(req.body);
    await newClass.save();
    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create Class', details: err });
  }
};

// Upload timetable file for a class
exports.uploadTimetable = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const timetableUrl = `/uploads/${req.file.filename}`;
    const updated = await Class.findByIdAndUpdate(
      req.params.id,
      { timetableUrl },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload timetable', details: err });
  }
};

// Get all Classes
exports.getAllClasses = async (req, res) => {
  try {
    const Classs = await Class.find();
    res.json(Classs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get Classes' });
  }
};

// Update Class
exports.updateClass = async (req, res) => {
  try {
    const updated = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update Class' });
  }
};

// Delete Class
exports.deleteClass = async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.json({ message: 'Class deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete Class' });
  }
};
