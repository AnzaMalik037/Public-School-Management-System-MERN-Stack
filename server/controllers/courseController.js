 //C:\Users\Anza\Desktop\school\server\controllers\courseController.js
const Course = require('../models/Course');
 
// Create Course
exports.createCourse = async (req, res) => {
  try {
    const { CourseId, CourseName, AssignedTeachers, AssignedClass, Syllabus } = req.body;
    const newCourse = new Course({ CourseId, CourseName, AssignedTeachers, AssignedClass, Syllabus });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create Course', details: err });
  }
};

// Get all Courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
    .populate('AssignedTeachers', 'name email')
    .populate('AssignedClass', 'classId');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get Courses' });
  }
};

// Update Course
exports.updateCourse = async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update Course' });
  }
};

// Delete Course
exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete Course' });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
