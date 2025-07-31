//C:\Users\Anza\Desktop\school3\school\client\src\pages\Admin\CourseManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, TableContainer, Typography, Box, Table, TableHead, TableRow, TableCell, TableBody, Button, Dialog, IconButton,
  DialogTitle, DialogContent, DialogActions, TextField} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [classList, setClassList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    CourseId: '',
    CourseName: '', AssignedClass: [],
    AssignedTeachers: [],
    Syllabus: ''
  });
  const [editCourseId, setEditCourseId] = useState(null);
  const [teacherList, setTeacherList] = useState([]);

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const res = await axios.get('/api/course');
      setCourses(res.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  // Fetch all teachers
  const fetchTeachers = async () => {
    try {
      const res = await axios.get('/api/teachers');
      setTeacherList(res.data);
    } catch (err) {
      console.error('Error fetching teachers:', err);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get('/api/class');
      setClassList(res.data);
    } catch (err) {
      console.error('Error fetching classes:', err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
    fetchClasses();
  }, []);

  const handleDialogOpen = () => {
    setFormData({
      CourseId: '',
      CourseName: '', AssignedClass: [],
      AssignedTeachers: [],
      Syllabus: ''
    });
    setEditCourseId(null);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditCourseId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTeacherChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData(prev => ({ ...prev, AssignedTeachers: selected }));
  };

  const handleFormSubmit = async () => {
    try {
      if (editCourseId) {
        await axios.put(`/api/course/${editCourseId}`, formData);
      } else {
        await axios.post('/api/course', formData);
      }
      fetchCourses();
      handleDialogClose();
    } catch (err) {
      console.error('Error saving course:', err);
    }
  };

  const handleEdit = (course) => {
    setFormData({
      CourseId: course.CourseId,
      CourseName: course.CourseName,
      AssignedTeachers: course.AssignedTeachers || [],
      Syllabus: course.Syllabus
    });
    setEditCourseId(course._id);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/course/${id}`);
      fetchCourses();
    } catch (err) {
      console.error('Error deleting course:', err);
    }
  };


  

  return (
    <div style={{ padding: '2rem' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Course Management</Typography>
        <IconButton onClick={handleDialogOpen}
          sx={{
            backgroundColor: 'green', color: 'white','&:hover': {backgroundColor: '#2e7d32'},
            width: 48,height: 48,borderRadius: '50%', boxShadow: 2}}>
          <Add />
        </IconButton>
      </Box>

      <TableContainer component={Paper}>  
        <Table>
          <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell>Course ID</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell>Assigned Teachers</TableCell>
              <TableCell>Assigned Class</TableCell>
              <TableCell>Syllabus</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course._id}>
                <TableCell>{course.CourseId}</TableCell>
                <TableCell>{course.CourseName}</TableCell>
                <TableCell>
                  {(course.AssignedTeachers || []).map(id => {
                    const teacher = teacherList.find(t => t._id === id);
                    return teacher ? teacher.name : 'Unknown';
                  }).join(', ')}
                </TableCell>

                <TableCell>
                  {(course.AssignedClass || []).map(id => {
                    const cls = classList.find(c => c._id === id);
                    return cls ? `Class ${cls.classId}${cls.classSection ? ' - ' + cls.classSection : ''}` : 'Unknown';
                  }).join(', ')}
                </TableCell>

                <TableCell style={{ whiteSpace: 'pre-line' }}>{course.Syllabus}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(course)} color="primary"><Edit/></IconButton>
                  <IconButton onClick={() => handleDelete(course._id)} color="error"><Delete/></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{editCourseId ? 'Edit Course' : 'Add Course'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Course ID"
            name="CourseId"
            value={formData.CourseId}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Course Name"
            name="CourseName"
            value={formData.CourseName}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <label style={{ marginTop: '1rem', display: 'block' }}>Assigned Teachers</label>
          <select
            multiple
            value={formData.AssignedTeachers}
            onChange={handleTeacherChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', marginBottom: '16px' }}
          >
            {teacherList.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.name}
              </option>
            ))}
          </select>
          
          <label style={{ marginTop: '1rem', display: 'block' }}>Assigned Classes</label>
          <select
            multiple
            value={formData.AssignedClass}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map(option => option.value);
              setFormData(prev => ({ ...prev, AssignedClass: selected }));
            }}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', marginBottom: '16px' }}
          >
            {classList.map((cls) => (
              <option key={cls._id} value={cls._id}>
                Class {cls.classId}
              </option>
            ))}
          </select>

          <TextField
            label="Syllabus"
            name="Syllabus"
            value={formData.Syllabus}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained" color="primary">
            {editCourseId ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CourseManagement;
