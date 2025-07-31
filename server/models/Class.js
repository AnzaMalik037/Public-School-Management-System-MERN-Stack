// models/Class.js
const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  classId: {
    type: Number,
    required: true,
    unique: true
  },
  classSection: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  classRep: {
    type: String,
    required: true
  },
  classRepContact: {
    type: String,
    required: true
  },
  timetableUrl: {
    type: String
  }

});

module.exports = mongoose.model('Class', ClassSchema);