//C:\Users\Anza\Desktop\school3\school\client\src\pages\Teachers\TeacherDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Link, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import profilePic from '../../assets/pfp.PNG';
import Profile from './TeacherProfile';
import Result from './ClassResult';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [teachingCourses, setTeachingCourses] = useState([]);
  const [timetableUrl, setTimetableUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem('auth')) || { name: 'Mr. Alan Grant' };
  const teacherName = user.name?.trim();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [coursesRes, teacherRes] = await Promise.all([
          axios.get(`/api/course/teacher/${encodeURIComponent(teacherName)}`),
          axios.get(`/api/teachers?name=${encodeURIComponent(teacherName)}`)
        ]);
        
        setTeachingCourses(coursesRes.data);
        setTimetableUrl(teacherRes.data[0]?.timetableUrl || '');
      } catch (err) {
        console.error("Error fetching data:", err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (teacherName) {
      fetchData();
    }
  }, [teacherName]);

  const handleCourseClick = (courseCode) => {
    navigate(`/teacher/courses/${courseCode}`);
  };

  const renderTimetableCell = () => {
    if (!timetableUrl) {
      return <Typography sx={{ color: 'gray' }}>No timetable available</Typography>;
    }

    return timetableUrl.endsWith('.pdf') ? (
      <Link
        href={`${process.env.REACT_APP_API_URL}${timetableUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          color: 'primary.main',
          textDecoration: 'underline',
          '&:hover': { textDecoration: 'underline' }
        }}
      >
        View Timetable
      </Link>
    ) : (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={`${process.env.REACT_APP_API_URL}${timetableUrl}`}
          alt="Timetable"
          style={{ 
            width: 100, 
            height: 60,
            objectFit: 'cover',
            cursor: 'pointer',
            borderRadius: 2
          }}
          onClick={() => window.open(`${process.env.REACT_APP_API_URL}${timetableUrl}`, '_blank')}
        />
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
        <Button 
          variant="outlined" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6">Welcome, Instructor {teacherName}</Typography>
          <Typography variant="subtitle1">Teacher Dashboard</Typography>
        </Box>
        <img 
          src={profilePic} 
          alt="Profile" 
          style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid #f5f5f5'
          }} 
        />
      </Box>

      {/* Navigation */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 4, 
        borderBottom: '1px solid #e0e0e0', 
        pb: 2, 
        flexWrap: 'wrap' 
      }}>
        <Button 
          variant={activeSection === 'dashboard' ? 'contained' : 'text'} 
          onClick={() => setActiveSection('dashboard')} 
          sx={{ textTransform: 'none' }}
        >
          Dashboard
        </Button>
        <Button 
          variant={activeSection === 'result' ? 'contained' : 'text'} 
          onClick={() => setActiveSection('result')} 
          sx={{ textTransform: 'none' }}
        >
          Result
        </Button>
        <Button 
          variant={activeSection === 'profile' ? 'contained' : 'text'} 
          onClick={() => setActiveSection('profile')} 
          sx={{ textTransform: 'none' }}
        >
          Profile
        </Button>
      </Box>

      {/* Dashboard Table */}
      {activeSection === 'dashboard' && (
        <>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            My Courses
          </Typography>

          {teachingCourses.length > 0 ? (
            <TableContainer component={Paper} elevation={3}>
              <Table sx={{ minWidth: 650 }} aria-label="teacher courses table">
                <TableHead sx={{ backgroundColor: 'primary.light' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: 'common.white' }}>Course Code</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'common.white' }}>Course Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'common.white' }}>Class</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teachingCourses.map((course) => (
                    <TableRow 
                      key={course._id}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{course.CourseId}</TableCell>
                      <TableCell><Link component="button"
                          onClick={() => handleCourseClick(course.CourseId)}
                          sx={{
                            color: 'primary.main', textAlign: 'left',
                            '&:hover': { 
                              textDecoration: 'underline',
                              backgroundColor: 'transparent'
                            }
                          }}
                        >
                          {course.CourseName}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {(course.AssignedClass || []).map(c =>
                          typeof c === 'object' && c !== null && c.classId
                            ? `Class ${c.classId}${c.classSection ? ' - ' + c.classSection : ''}`
                            : 'Unknown Class'
                        ).join(', ')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography sx={{ color: 'text.secondary' }}>
                No courses assigned yet.
              </Typography>
            </Paper>
          )}
          <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
            {renderTimetableCell()} </Typography> 

        </>
      )}

      {/* Other Sections */}
      {activeSection === 'result' && (
        <Result assignedCourseIds={teachingCourses.map(c => c._id)} />
      )}
      {activeSection === 'profile' && <Profile />}
    </Box>
  );
};

export default TeacherDashboard;