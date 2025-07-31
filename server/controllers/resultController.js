//C:\Users\Anza\Desktop\school3\school\server\controllers\resultController.js
const Result = require('../models/Result');
const Student = require('../models/Student');
const Course = require('../models/Course');

// CREATE Result
const createResult = async (req, res) => {
  try {
    const { studentId, course, assignments, quizzes, midterm, final, attendance } = req.body;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const courseExists = await Course.findById(course);
    if (!courseExists) return res.status(404).json({ message: 'Course not found' });

    const newResult = new Result({
      student: studentId, course, assignments,
      quizzes, midterm, final, attendance
    });

    await newResult.save();
    res.status(201).json({ message: 'Result added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET All Results
const getAllResults = async (req, res) => {
  try {
    const results = await Result.find().populate('student').populate('course');
    const formatted = results.map(r => ({
       _id: r._id, 
      name: r.student?.name || "Unknown",
      course: r.course?._id,
      courseName: r.course?.CourseName || "Unknown",
      assignments: r.assignments, quizzes: r.quizzes,
      midterm: r.midterm, final: r.final, attendance: r.attendance
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 


// UPDATE Result
const updateResult = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Result.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Result not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE Result
const deleteResult = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Result.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Result not found' });
    }
    res.json({ message: 'Result deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Then add them to your exports
module.exports = { createResult, getAllResults, updateResult, deleteResult};