// models/Teacher.js
const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  teacherId: {
    type: String,
    required: true,
    unique: true
  }, 
  name: {
    type: String,
    required: true
  },
  password: {
    type: String, 
    required: true
  },
  email: {
    type: String,
    required: true
  }, 
  phone: {
    type: String,
    required: true
  },
  office: {
    type: String,
    required: true
  },
  hours: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  timetableUrl: {
    type: String
  }
});

module.exports = mongoose.model('Teacher', TeacherSchema);