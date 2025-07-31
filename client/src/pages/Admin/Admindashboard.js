// src/pages/Admin/AdminDashboard.js
import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import TeachersManagement from './TeacherManagement';
import ClassManagement from './ClassManagement';
import StudentManagement from './StudentManagement';
import CourseManagement from './CourseManagement';
import FeeSlip from './FeeSlips';


const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem('auth'));
  const [activeSection, setActiveSection] = useState('teacher');
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name || 'admin'}!
      </Typography>

      {/* Tabs */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, borderBottom: '1px solid #e0e0e0', pb: 2, flexWrap: 'wrap' }}>

        <Button
          variant={activeSection === 'teacher' ? 'contained' : 'text'}
          onClick={() => setActiveSection('teacher')}
          sx={{ textTransform: 'none' }}
        >Teachers</Button>

        <Button
          variant={activeSection === 'course' ? 'contained' : 'text'}
          onClick={() => setActiveSection('course')}
          sx={{ textTransform: 'none' }}
        > Course </Button>

        <Button
          variant={activeSection === 'class' ? 'contained' : 'text'}
          onClick={() => setActiveSection('class')}
          sx={{ textTransform: 'none' }}
        > Classes </Button>

        <Button
          variant={activeSection === 'student' ? 'contained' : 'text'}
          onClick={() => setActiveSection('student')}
          sx={{ textTransform: 'none' }}
        >Students</Button>

        <Button
          variant={activeSection === 'fee' ? 'contained' : 'text'}
          onClick={() => setActiveSection('fee')}
          sx={{ textTransform: 'none' }}
        >Fee Slips</Button>


      </Box>

       
      {/* Section rendering */}
      {activeSection === 'teacher' && <TeachersManagement />}      
      {activeSection === 'course' && <CourseManagement />}
      {activeSection === 'class' && <ClassManagement />}
      {activeSection === 'student' && <StudentManagement />}
      {activeSection === 'fee' && <FeeSlip/>}

      {/* Footer */}

    </Box>
  );
};

export default AdminDashboard;
