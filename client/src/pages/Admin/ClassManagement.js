//C:\Users\Anza\Desktop\school3\school\client\src\pages\Admin\ClassManagement.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, IconButton, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Button
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';

const ClassManagement = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [classes, setClasses] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    classId: '',
    classSection: '',
    classRep: '',
    classRepContact: ''
  });

  const fetchClasses = async () => {
    try {
      const res = await axios.get('/api/class');
      setClasses(res.data);
    } catch (err) {
      console.error('Error fetching classes:', err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveClass = async () => {
    try {
      if (editingId) {
        await axios.put(`/api/class/${editingId}`, formData);
      } else {
        await axios.post('/api/class', formData);
      }
      setOpen(false);
      setEditingId(null);
      setFormData({
        classId: '',
        classSection: '',
        classRep: '',
        classRepContact: ''
      });
      fetchClasses();
    } catch (err) {
      console.error('Error submitting class:', err);
    }
  };

  const handleEdit = (c) => {
    setFormData({
      classId: c.classId,
      classSection: c.classSection,
      classRep: c.classRep,
      classRepContact: c.classRepContact
    });
    setEditingId(c._id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await axios.delete(`/api/class/${id}`);
        fetchClasses();
      } catch (err) {
        console.error('Error deleting class:', err);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Class Management</Typography>
        <IconButton
          onClick={() => {
            setOpen(true);
            setEditingId(null);
            setFormData({
              classId: '',
              classSection: '',
              classRep: '',
              classRepContact: ''
            });
          }}
          sx={{
            backgroundColor: 'green',
            color: 'white',
            '&:hover': {
              backgroundColor: '#2e7d32' // darker green on hover
            },
            width: 48,
            height: 48,
            borderRadius: '50%',
            boxShadow: 2
          }}
        >
          <Add />
        </IconButton>

      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell>Class</TableCell>
              <TableCell>Class Rep</TableCell>
              <TableCell>Rep Contact</TableCell>
              <TableCell>Time Table</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.map((c) => (
              <TableRow key={c._id}>
                <TableCell>{c.classId}{c.classSection}</TableCell>
                <TableCell>{c.classRep}</TableCell>
                <TableCell>{c.classRepContact}</TableCell>
                <TableCell>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    style={{ display: 'none' }}
                    id={`upload-timetable-${c._id}`}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const formData = new FormData();
                      formData.append('timetable', file);
                      try {
                        await axios.post(`/api/class/${c._id}/upload-timetable`, formData, {
                          headers: { 'Content-Type': 'multipart/form-data' }
                        });
                        fetchClasses();
                      } catch (err) {
                        alert('Upload failed');
                      }
                    }}
                  />
                  <label htmlFor={`upload-timetable-${c._id}`}>
                    <Button variant="outlined" component="span" size="small">
                      Upload
                    </Button>
                  </label>
                  {/* Show link or preview if timetable exists */}
                  {c.timetableUrl && (
                    c.timetableUrl.endsWith('.pdf') ? (
                      <a
                        href={`${API_URL}${c.timetableUrl}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginLeft: 8 }}
                      >
                        View
                      </a>
                    ) : (
                      <img
                        src={`${API_URL}${c.timetableUrl}`} 
                        alt="Timetable"
                        style={{ width: 40, marginLeft: 8 }}
                      />
                    )
                  )} 
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(c)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(c._id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Add/Edit */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{editingId ? 'Edit Class' : 'Add Class'}</DialogTitle>
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
              required
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveClass}>
            {editingId ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClassManagement;
