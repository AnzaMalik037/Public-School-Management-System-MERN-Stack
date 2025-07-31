 
 //C:\Users\Anza\Desktop\school\server\routes\courseRoutes.js
 const express = require('express');
 const router = express.Router();
 const courseController = require('../controllers/courseController');
 const Teacher = require('../models/Teacher');
 const Course = require('../models/Course');
 const Class = require('../models/Class');
 const Student = require('../models/Student');

 router.post('/', courseController.createCourse);
 router.get('/', courseController.getAllCourses);
 router.put('/:id', courseController.updateCourse);
 router.delete('/:id', courseController.deleteCourse);


 // GET /api/courses/byteacher/:name
   router.get('/teacher/:name', async (req, res) => {
    try {
        const teacherName = req.params.name;
        const teacher = await Teacher.findOne({ name: teacherName });

        if (!teacher) {
        return res.status(404).json({ error: 'Teacher not found' });
        }
        const courses = await Course.find({ AssignedTeachers: teacher._id })
        .populate('AssignedClass')
        .populate('AssignedTeachers');
        
        res.json(courses);
    } catch (err) {
        console.error("Error fetching teacher courses:", err);
        res.status(500).json({ error: 'Failed to fetch courses for teacher' });
    }
    });

 
  // GET /api/courses/class/:id
  router.get('/class/:id', async (req, res) => {
    try {
      const classId = req.params.id;
      const classObj = await Class.findOne({ classId: classId });

      if (!classObj) {
        return res.status(404).json({ error: 'Class not found' });
      }

      const courses = await Course.find({ AssignedClass: classObj._id })
       .populate('AssignedTeachers', 'name email');

      res.json(courses);
    } catch (err) {
      console.error("Error fetching class courses:", err);
      res.status(500).json({ error: 'Failed to fetch courses for class' });
    }
  });

  

  // GET /api/course/:courseCode
  router.get('/:courseCode', async (req, res) => {
    try {
      const courseCode = req.params.courseCode;
      const course = await Course.findOne({ CourseId: courseCode })
        .populate('AssignedClass')
        .populate('AssignedTeachers');

      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      res.json(course);
    } catch (err) {
      console.error("Error fetching course:", err);
      res.status(500).json({ error: 'Failed to fetch course' });
    }
  });

  // PATCH /api/course/:id - update course fields
router.patch('/:id', async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('AssignedTeachers').populate('AssignedClass');

    res.json(updated);
  } catch (err) {
    console.error("Course update error:", err);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// PUT /api/course/:courseId/assignment/:index
router.put('/:courseId/assignment/:index', async (req, res) => {
  const { courseId, index } = req.params;
  const { due } = req.body;

  try {
    const course = await Course.findOne({ CourseId: courseId });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (!course.assignments[index]) {
      return res.status(400).json({ error: 'Invalid assignment index' });
    }

    course.assignments[index].due = due;
    await course.save();

    res.json({ success: true, updatedAssignment: course.assignments[index] });
  } catch (err) {
    console.error('Failed to update assignment due date:', err);
    res.status(500).json({ error: 'Failed to update assignment' });
  }
});

// PUT /api/course/:courseCode/assignment/:index
router.put('/:courseCode/assignment/:index', async (req, res) => {
  try {
    const { courseCode, index } = req.params;
    const { due } = req.body;

    const course = await Course.findOne({ CourseId: courseCode })
    .populate('assignments.submissions.studentId', 'name'); // populate name only

    // Map the populated name
    course.assignments.forEach(assignment => {
      assignment.submissions.forEach(sub => {
        sub.studentName = sub.studentId.name;
      });
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const assignmentIndex = parseInt(index);
    if (
      isNaN(assignmentIndex) ||
      assignmentIndex < 0 ||
      assignmentIndex >= course.assignments.length
    ) {
      return res.status(400).json({ error: 'Invalid assignment index' });
    }

    course.assignments[assignmentIndex].due = due;
    await course.save();

    res.json({ message: 'Assignment updated successfully' });
  } catch (err) {
    console.error('Error updating assignment:', err);
    res.status(500).json({ error: 'Failed to update assignment' });
  }
});

// POST /api/course/:courseId/assignment/:index/submit
const multer = require('multer');
const path = require('path');

// File storage config
const fs = require('fs');
const submissionsDir = path.join(__dirname, '../uploads/submissions');
if (!fs.existsSync(submissionsDir)) {
  fs.mkdirSync(submissionsDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/submissions/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.post('/:courseId/assignment/:index/submit',
  upload.single('file'),
  async (req, res) => {
    try {
      const { courseId, index } = req.params;
      const { studentId } = req.body;

      const course = await Course.findOne({ CourseId: courseId });
      if (!course || !course.assignments[index]) {
        return res.status(404).json({ error: 'Assignment not found' });
      }

      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      const fileUrl = `/uploads/submissions/${req.file.filename}`;

      course.assignments[index].submissions.push({
        studentId,
        fileUrl,
        submittedAt: new Date(),
        // embed name explicitly into a new field
        studentName: student.name
      });

      await course.save();
      res.status(200).json({ message: 'Submission saved' });
    } catch (err) {
      console.error('Submission error:', err);
      res.status(500).json({ error: 'Submission failed' });
    }
  });



 module.exports = router;
 