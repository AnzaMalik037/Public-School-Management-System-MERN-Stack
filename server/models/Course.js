// models/Course.js
const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  CourseId: {
    type: String,
    required: true,
    unique: true
  },
  CourseName: {
    type: String,
    required: true
  },
  AssignedTeachers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  }],
  AssignedClass: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }],
  Syllabus: {
    type: String,
    required: true
  },
  assignments: [{
    name: String,
    due: Date,
    submissions: [{
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
      studentName: String,
      fileUrl: String,
      submittedAt: Date
    }]
  }]
});

module.exports = mongoose.model('Course', CourseSchema);