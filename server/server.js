//C:\Users\Anza\Desktop\school\server\server.js
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const resultRoutes = require('./routes/resultRoutes');
const uploadRoute = require('./routes/upload');

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use('/api', uploadRoute);

// Basic Test Route
app.get('/', (req, res) => res.send('API Running...'));
// Serve uploaded files statically
app.use('/uploads', express.static(require('path').join(__dirname, '../uploads')));
app.use('/uploads/submissions', express.static(path.join(__dirname, 'uploads', 'submissions')));
// Basic Test Route
app.get('/', (req, res) => res.send('API Running...'));

 
// Routes here
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/teachers', require('./routes/teacherRoutes'));
app.use('/api/class', require('./routes/classRoutes'));
app.use('/api/course', require('./routes/courseRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));
app.use('/api/upload', require('./routes/upload'));
app.use('/fee-slips', express.static(path.join(__dirname, 'uploads/fee-slips')));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
