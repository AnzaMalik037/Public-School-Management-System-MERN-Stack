//C:\Users\Anza\Desktop\school3\school\client\src\pages\Admin\StudentManagement.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Dialog,
  DialogTitle, DialogContent, TextField, DialogActions,
  IconButton, Collapse
} from '@mui/material';
import { Delete, Edit, Add, ExpandMore, ExpandLess } from '@mui/icons-material';

const StudentManagement = () => {
  const [groupedStudents, setGroupedStudents] = useState({});
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedClasses, setExpandedClasses] = useState({});
  const [formData, setFormData] = useState({
    studentId: '', classID: '', classSection: '',
    name: '', fatherGuardian: '', email: '',
    emergencyContact: '', address: '', bloodGroup: '',
    disabilities: ''
  });

  const fetchStudents = async () => {
    try {
      const res = await axios.get('/api/students');
      // Group students by classID and classSection
      const grouped = res.data.reduce((acc, student) => {
        const key = `${student.classID}-${student.classSection}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(student);
        return acc;
      }, {});
      setGroupedStudents(grouped);
      
      // Initialize all classes as expanded by default
      const initialExpanded = {};
      Object.keys(grouped).forEach(key => {
        initialExpanded[key] = true;
      });
      setExpandedClasses(initialExpanded);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const toggleClassExpansion = (classKey) => {
    setExpandedClasses(prev => ({
      ...prev,
      [classKey]: !prev[classKey]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveStudent = async () => {
    try {
      if (editingId) {
        await axios.put(`/api/students/${editingId}`, formData);
      } else {
        await axios.post('/api/students', formData);
      }
      setOpen(false);
      setEditingId(null); 
      setFormData({
        studentId: '', classID: '', classSection: '',
        name: '', fatherGuardian: '', email: '',
        emergencyContact: '', address: '', bloodGroup: '',
        disabilities: ''
      });
      fetchStudents();
    } catch (err) {
      console.error('❌ Error saving student:', err.response?.data || err.message);
      alert("Failed to save student.");
    }
  };

  const handleEdit = (student) => {
    setFormData({
      studentId: student.studentId || '',
      classID: student.classID || '',
      classSection: student.classSection || '',
      name: student.name || '',
      fatherGuardian: student.fatherGuardian || '',
      email: student.email || '',
      emergencyContact: student.emergencyContact || '',
      address: student.address || '',
      bloodGroup: student.bloodGroup || '',
      disabilities: student.disabilities || ''
    });
    setEditingId(student._id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`/api/students/${id}`);
        fetchStudents();
      } catch (err) {
        console.error('Error deleting student:', err);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Student Management</Typography>
        <IconButton
          onClick={() => {
            setOpen(true);
            setEditingId(null);
            setFormData({
              studentId: '', classID: '', classSection: '',
              name: '', fatherGuardian: '', email: '',
              emergencyContact: '', address: '', bloodGroup: '',
              disabilities: ''
            });
          }}
          sx={{
            backgroundColor: 'green', 
            color: 'white', 
            '&:hover': {backgroundColor: '#2e7d32'},
            width: 48, 
            height: 48,
            borderRadius: '50%',
            boxShadow: 2
          }}
        >
          <Add />
        </IconButton>
      </Box>

      {Object.entries(groupedStudents).map(([classKey, classStudents]) => {
        const [classID, classSection] = classKey.split('-');
        return (
          <Paper key={classKey} sx={{ mb: 3 }}>
            <Box 
              display="flex" 
              justifyContent="space-between" 
              alignItems="center" 
              p={2}
              sx={{ 
                backgroundColor: '#f0f0f0',
                cursor: 'pointer'
              }}
              onClick={() => toggleClassExpansion(classKey)}
            >
              <Typography variant="h6">
                Class {classID} - Section {classSection} 
                <Typography component="span" variant="body2" sx={{ ml: 2 }}>
                  ({classStudents.length} students)
                </Typography>
              </Typography>
              <IconButton size="small">
                {expandedClasses[classKey] ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
            
            <Collapse in={expandedClasses[classKey]}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Guardian</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>Blood Group</TableCell>
                      <TableCell>Disabilities</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {classStudents.map((student) => (
                      <TableRow key={student._id}>
                        <TableCell>{student.studentId}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.fatherGuardian}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.emergencyContact}</TableCell>
                        <TableCell>{student.address}</TableCell>
                        <TableCell>{student.bloodGroup}</TableCell>
                        <TableCell>{student.disabilities}</TableCell>
                        <TableCell>
                          <IconButton color="primary" onClick={() => handleEdit(student)}>
                            <Edit />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDelete(student._id)}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Collapse>
          </Paper>
        );
      })}

      {/* Add/Edit Student Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{editingId ? 'Edit Student' : 'Add Student'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            {Object.keys(formData).map((key) => (
              <TextField
                key={key}
                margin="dense"
                name={key}
                label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                fullWidth
                value={formData[key]}
                onChange={handleChange}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveStudent}>
            {editingId ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentManagement;