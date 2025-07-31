import {
  Box, Typography, Button, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Link, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileInfo from './StudentProfile.js';
import StudentFee from './StudentProfile.js';
import StudentResult from './StudentResult.js';
import profilePic from '../../assets/pfp.PNG';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [studentData, setStudentData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentAndCourses = async () => {
      try {
        const auth = JSON.parse(localStorage.getItem('auth')) || {};
        const studentName = auth.name || auth.user?.name;

        if (!studentName) {
          throw new Error('Student name not found in localStorage');
        }

        const res = await axios.get(`/api/students/byname?name=${encodeURIComponent(studentName)}`);
        setStudentData(res.data);

        // Fetch courses using classID
        const classId = res.data.classID;
        const courseRes = await axios.get(`/api/course/class/${classId}`);
        setCourses(courseRes.data);
      } catch (err) {
        console.error("Failed to load student profile or courses", err);
        setError("Failed to load student profile or courses");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentAndCourses();
  }, []);

  const handleCourseClick = (courseCode) => {
    navigate(`/student/courses/${courseCode}`);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !studentData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error || "No student data available."}</Typography>
        <Button variant="outlined" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3
      }}>
        <Box>
          <Typography variant="h6">Welcome, {studentData.name}</Typography>
          <Typography variant="subtitle1">Student ID: {studentData.studentId}</Typography>
          <Typography variant="subtitle1">Class ID: {studentData.classID}</Typography>
        </Box>
        <img src={profilePic} alt="Profile" style={{ width: '120px', height: '120px', borderRadius: '50%' }} />
      </Box>

      {/* Tabs */}
      <Box sx={{
        display: 'flex',
        gap: 2,
        mb: 4,
        borderBottom: '1px solid #e0e0e0',
        pb: 2,
        flexWrap: 'wrap'
      }}>
        <Button variant={activeSection === 'dashboard' ? 'contained' : 'text'} onClick={() => setActiveSection('dashboard')} sx={{ textTransform: 'none' }}> Dashboard</Button>
        <Button variant={activeSection === 'fee' ? 'contained' : 'text'} onClick={() => setActiveSection('fee')} sx={{ textTransform: 'none' }}> Fee </Button>
        <Button variant={activeSection === 'result' ? 'contained' : 'text'} onClick={() => setActiveSection('result')} sx={{ textTransform: 'none' }}> Result </Button>
        <Button variant={activeSection === 'profile' ? 'contained' : 'text'} onClick={() => setActiveSection('profile')} sx={{ textTransform: 'none' }}> Profile </Button>
      </Box>

      {/* Dashboard Table */}
      {activeSection === 'dashboard' && (
        <>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            My Courses
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table sx={{ minWidth: 650 }} aria-label="courses table">
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Code</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Course Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Instructor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course._id} hover>
                    <TableCell>{course.CourseId}</TableCell>
                    <TableCell>
                      <Link
                        component="button"
                        onClick={() => handleCourseClick(course.CourseId)}
                        sx={{
                          textAlign: 'left',
                          color: 'primary.main',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        {course.CourseName}
                      </Link>
                    </TableCell>
<TableCell>
  {course.AssignedTeachers && course.AssignedTeachers.length > 0
    ? course.AssignedTeachers.map(t => t.name).join(', ')
    : 'N/A'}
</TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Other Sections */}
      {activeSection === 'fee' && <StudentFee />}
      {activeSection === 'result' && <StudentResult studentId={studentData._id} studentName={studentData.name} />}
      {activeSection === 'profile' && <ProfileInfo />}
    </Box>
  );
};

export default StudentDashboard;
