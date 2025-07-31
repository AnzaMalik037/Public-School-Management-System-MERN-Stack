//C:\Users\Anza\Desktop\school3\school\server\models\Result.js

const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  assignments: [{ type: Number }],
  quizzes: [{ type: Number }],
  midterm: { type: Number },
  final: { type: Number },
  attendance: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
