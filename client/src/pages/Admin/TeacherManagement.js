import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Paper, Dialog, DialogTitle, DialogContent, TextField, DialogActions,
  IconButton
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';

const TeacherManagement = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [teachers, setTeachers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    teacherId: '', name: '', email: '', phone: '',
    office: '', hours: '', department: '',
    qualification: '', specialization: ''
  });

  const fetchTeachers = async () => {
    try {
      const res = await axios.get('/api/admin/teachers');
      setTeachers(res.data);
    } catch (err) {
      console.error('Error fetching teachers:', err);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveTeacher = async () => {
    try {
      if (editingId) {
        await axios.put(`/api/teachers/${editingId}`, formData);
      } else {
        await axios.post('/api/teachers', formData);
      }
      setOpen(false);
      setEditingId(null);
      setFormData({
        teacherId: '', name: '', email: '', phone: '',
        office: '', hours: '', department: '',
        qualification: '', specialization: ''
      });
      fetchTeachers();
    } catch (err) {
      console.error('Error saving teacher:', err);
    }
  };

  const handleEdit = (teacher) => {
    setFormData({
      teacherId: teacher.teacherId || '',
      name: teacher.name || '',
      email: teacher.email || '',
      phone: teacher.phone || '',
      office: teacher.office || '',
      hours: teacher.hours || '',
      department: teacher.department || '',
      qualification: teacher.qualification || '',
      specialization: teacher.specialization || '',
    });
    setEditingId(teacher._id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await axios.delete(`/api/teachers/${id}`);
        fetchTeachers();
      } catch (err) { 
        console.error('Error deleting teacher:', err);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Teachers Management</Typography>
        <IconButton
          onClick={() => {
            setOpen(true);
            setEditingId(null);
            setFormData({
              teacherId: '', name: '', email: '', phone: '',
              office: '', hours: '', department: '',
              qualification: '', specialization: ''
            });
          }}
          sx={{backgroundColor: 'green', color: 'white', '&:hover': {backgroundColor: '#2e7d32'},
            width: 48, height: 48,borderRadius: '50%',boxShadow: 2}}>
          <Add />
        </IconButton>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Qualification</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Time Table</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher._id}>
                <TableCell>{teacher.name}</TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>{teacher.phone}</TableCell>
                <TableCell>{teacher.department}</TableCell>
                <TableCell>{teacher.qualification}</TableCell>
                <TableCell>{teacher.specialization}</TableCell>
                <TableCell>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    style={{ display: 'none' }}
                    id={`upload-timetable-${teacher._id}`}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const formData = new FormData();
                      formData.append('timetable', file);
                      try {
                        await axios.post(`/api/teachers/${teacher._id}/upload-timetable`, formData, {
                          headers: { 'Content-Type': 'multipart/form-data' }
                        });
                        fetchTeachers();
                      } catch (err) {
                        alert('Upload failed');
                      }
                    }}
                  />
                  <label htmlFor={`upload-timetable-${teacher._id}`}>
                    <Button variant="outlined" component="span" size="small">
                      Upload
                    </Button>
                  </label>
                  {/* Show link or preview if timetable exists */}
                  {teacher.timetableUrl && ( 
                    teacher.timetableUrl.endsWith('.pdf') ? (
                      <a
                        href={`${API_URL}${teacher.timetableUrl}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginLeft: 8 }}
                      >
                        View
                      </a>
                    ) : (
                      <img
                        src={`${API_URL}${teacher.timetableUrl}`} 
                        alt="Timetable"
                        style={{ width: 40, marginLeft: 8 }}
                      />
                    )
                  )}
                </TableCell>          
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(teacher)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(teacher._id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Teacher Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{editingId ? 'Edit Teacher' : 'Add Teacher'}</DialogTitle>
        <DialogContent>
          {Object.keys(formData).map((key) => (
            <TextField
              key={key}
              margin="dense"
              name={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              fullWidth
              value={formData[key]}
              onChange={handleChange}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveTeacher}>
            {editingId ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherManagement;
