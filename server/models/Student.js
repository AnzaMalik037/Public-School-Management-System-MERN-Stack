const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  classID: {
    type: Number,
    required: true
  },
  classSection: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  fatherGuardian: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  emergencyContact: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  bloodGroup: {
    type: String
  },
  disabilities: {
    type: String,
    default: 'None'
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
