// C:\Users\Anza\Desktop\school3\school\client\src\pages\Teachers\ClassResult.js
import {
  Box, Typography, IconButton, Collapse, Paper, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, MenuItem, Alert, CircularProgress
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Add, Edit, Delete, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

const TOTAL_CLASSES = 200;

const ClassResult = ({ assignedCourseIds }) => {
  const [groupedResults, setGroupedResults] = useState({});
  const [expandedCourses, setExpandedCourses] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [editDialog, setEditDialog] = useState({open: false, result: null, errors: {}});
  
  const [form, setForm] = useState({
    studentId: '', course: '',
    assignments: ['', '', '', ''],
    quizzes: ['', '', '', ''],
    midterm: '', final: '', attendance: ''});

  const [formErrors, setFormErrors] = useState({studentId: false, course: false});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resultsRes, studentsRes, coursesRes] = await Promise.all([
          axios.get('/api/results'),
          axios.get('/api/students'),
          axios.get('/api/courses')
        ]);

        const allCourses = coursesRes.data;
        setCourses(allCourses);
        setStudents(studentsRes.data);

        // ✅ Filter results by only those related to assignedCourseIds
        const filteredResults = resultsRes.data.filter(result =>
          assignedCourseIds.includes(result.course)
        );

        const grouped = filteredResults.reduce((acc, result) => {
          const key = result.courseName
          if (!acc[key]) acc[key] = [];
          acc[key].push(result);
          return acc;
        }, {});

        setGroupedResults(grouped);

        const initialExpanded = {};
        Object.keys(grouped).forEach(course => {
          initialExpanded[course] = true;
        });
        setExpandedCourses(initialExpanded);

      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assignedCourseIds]);




  const toggleCourseExpand = (courseName) => {
    setExpandedCourses(prev => ({
      ...prev,
      [courseName]: !prev[courseName]
    }));
  };

  const validateForm = () => {
    const errors = {
      studentId: !form.studentId,
      course: !form.course,
      assignments: form.assignments.some(a => a === ''),
      quizzes: form.quizzes.some(q => q === ''),
      midterm: !form.midterm,
      final: !form.final,
      attendance: !form.attendance
    };
    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const validateEditForm = () => {
    const errors = {
      course: !editDialog.result.course,
      assignments: editDialog.result.assignments.some(a => a === ''),
      quizzes: editDialog.result.quizzes.some(q => q === ''),
      midterm: !editDialog.result.midterm,
      final: !editDialog.result.final,
      attendance: !editDialog.result.attendance
    };
    setEditDialog(prev => ({ ...prev, errors }));
    return !Object.values(errors).some(Boolean);
  };

  const handleFormChange = (e, index = null, type = null) => {
    const { name, value } = e.target;
    if (type === 'assignment' || type === 'quiz') {
      const updated = [...form[type === 'assignment' ? 'assignments' : 'quizzes']];
      updated[index] = value;
      setForm({ ...form, [type === 'assignment' ? 'assignments' : 'quizzes']: updated });
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const formatted = {
        studentId: form.studentId,
        course: form.course,
        assignments: form.assignments.map(Number),
        quizzes: form.quizzes.map(Number),
        midterm: Number(form.midterm),
        final: Number(form.final),
        attendance: Number(form.attendance)
      };

      await axios.post('/api/results/add', formatted);
      setShowAddForm(false);
      setForm({studentId: '', course: '',
        assignments: ['', '', '', ''], quizzes: ['', '', '', ''],
        midterm: '', final: '', attendance: '' });

      // Refresh data
      const res = await axios.get('/api/results');
      const grouped = res.data.reduce((acc, result) => {
        const key = result.course;
        if (!acc[key]) acc[key] = [];
        acc[key].push(result);
        return acc;
      }, {});
      setGroupedResults(grouped);
    } catch (err) {
      console.error('Error adding result:', err);
      setError('Failed to add result');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this result?')) return;

    try {
      await axios.delete(`/api/results/${id}`);
      const res = await axios.get('/api/results');
      const grouped = res.data.reduce((acc, result) => {
        const key = result.course;
        if (!acc[key]) acc[key] = [];
        acc[key].push(result);
        return acc;
      }, {});
      setGroupedResults(grouped);
    } catch (err) {
      console.error('Error deleting result:', err);
      setError('Failed to delete result');
    }
  };

  const handleEditSubmit = async () => {
    if (!validateEditForm()) return;

    try {
      await axios.patch(`/api/results/${editDialog.result._id}`, {
        ...editDialog.result,
        assignments: editDialog.result.assignments.map(Number),
        quizzes: editDialog.result.quizzes.map(Number),
        midterm: Number(editDialog.result.midterm),
        final: Number(editDialog.result.final),
        attendance: Number(editDialog.result.attendance)
      });

      setEditDialog({ open: false, result: null });
      
      // Refresh data
      const res = await axios.get('/api/results');
      const grouped = res.data.reduce((acc, result) => {
        const key = result.course;
        if (!acc[key]) acc[key] = [];
        acc[key].push(result);
        return acc;
      }, {});
      setGroupedResults(grouped);
    } catch (err) {
      console.error('Error updating result:', err);
      setError('Failed to update result');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Class Results</Typography>
        <IconButton 
          onClick={() => setShowAddForm(true)}
          sx={{
            backgroundColor: 'green',color: 'white', '&:hover': { backgroundColor: '#2e7d32' },
            width: 48, height: 48, borderRadius: '50%', boxShadow: 2
          }}>
          <Add />
        </IconButton>
      </Box>

      {/* Collapsible Grouped Result Tables */}
      {Object.entries(groupedResults).map(([courseName, courseResults]) => (
        <Paper key={courseName} sx={{ mb: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center" p={2}
            sx={{
              backgroundColor: '#f0f0f0', cursor: 'pointer',
              '&:hover': { backgroundColor: '#e0e0e0' }
            }} onClick={() => toggleCourseExpand(courseName)}
          >
            <Box display="flex" alignItems="center">
              {expandedCourses[courseName] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              <Typography variant="h6" sx={{ ml: 1 }}>
                {courseName} 
                <Typography component="span" variant="body2" sx={{ ml: 2 }}>
                  ({courseResults.length} student{courseResults.length !== 1 ? 's' : ''})
                </Typography>
              </Typography>
            </Box>
          </Box>

          <Collapse in={expandedCourses[courseName]}>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Student Name</TableCell>
                    {[1, 2, 3, 4].map(num => (
                      <TableCell key={`a${num}`} sx={{ fontWeight: 'bold' }}>A {num}</TableCell>
                    ))}
                    {[1, 2, 3, 4].map(num => (
                      <TableCell key={`q${num}`} sx={{ fontWeight: 'bold' }}>Quiz {num}</TableCell>
                    ))}
                    <TableCell sx={{ fontWeight: 'bold' }}>Midterm</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Final</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Attendance</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courseResults.map((student) => {
                    const attendanceIsLow = student.attendance < 0.8 * TOTAL_CLASSES;
                    return (
                      <TableRow key={student._id}>
                        <TableCell>{student.name}</TableCell>
                        {student.assignments.map((mark, i) => (
                          <TableCell key={`a-${student._id}-${i}`}>
                            <TextField
                              type="number"
                              size="small"
                              value={mark}
                              InputProps={{ readOnly: true }}
                              sx={{ width: 60 }}
                            />
                          </TableCell>
                        ))}
                        {student.quizzes.map((mark, i) => (
                          <TableCell key={`q-${student._id}-${i}`}>
                            <TextField
                              type="number"
                              size="small"
                              value={mark}
                              InputProps={{ readOnly: true }}
                              sx={{ width: 60 }}
                            />
                          </TableCell>
                        ))}
                        <TableCell>
                          <TextField
                            type="number"
                            size="small"
                            value={student.midterm}
                            InputProps={{ readOnly: true }}
                            sx={{ width: 60 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            size="small"
                            value={student.final}
                            InputProps={{ readOnly: true }}
                            sx={{ width: 60 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            size="small"
                            value={student.attendance}
                            InputProps={{ readOnly: true }}
                            sx={{
                              width: 60,
                              input: {
                                color: attendanceIsLow ? 'error.main' : 'inherit'
                              }
                            }}
                            error={attendanceIsLow}
                            helperText={attendanceIsLow ? 'Below 80%' : ''}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            onClick={() => setEditDialog({ 
                              open: true, 
                              result: { ...student },
                              errors: {}
                            })}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(student._id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Collapse>
        </Paper>
      ))}

      {/* Add Result Form Dialog */}
      <Dialog open={showAddForm} onClose={() => setShowAddForm(false)} fullWidth maxWidth="md">
        <DialogTitle>Add New Result</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
            <TextField
              select
              name="studentId"
              label="Student"
              value={form.studentId}
              onChange={handleFormChange}
              error={formErrors.studentId}
              helperText={formErrors.studentId ? 'Student is required' : ''}
              fullWidth
              required
            >
              {students.map(s => (
                <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Course"
              name="course"
              value={form.course}
              onChange={handleFormChange}
              error={formErrors.course}
              helperText={formErrors.course ? 'Course is required' : ''}
              fullWidth
            >
              {courses.filter(c => assignedCourseIds.includes(c._id)).map(c => (
                <MenuItem key={c._id} value={c._id}>
                  {c.CourseName}
                </MenuItem>
              ))}
            </TextField>


            {[0, 1, 2, 3].map(i => (
              <TextField
                key={`a${i}`}
                label={`Assignment ${i + 1}`}
                type="number"
                value={form.assignments[i]}
                onChange={(e) => handleFormChange(e, i, 'assignment')}
                error={formErrors.assignments && form.assignments[i] === ''}
                helperText={formErrors.assignments && form.assignments[i] === '' ? 'Required' : ''}
              />
            ))}

            {[0, 1, 2, 3].map(i => (
              <TextField
                key={`q${i}`}
                label={`Quiz ${i + 1}`}
                type="number"
                value={form.quizzes[i]}
                onChange={(e) => handleFormChange(e, i, 'quiz')}
                error={formErrors.quizzes && form.quizzes[i] === ''}
                helperText={formErrors.quizzes && form.quizzes[i] === '' ? 'Required' : ''}
              />
            ))}

            <TextField
              label="Midterm"
              name="midterm"
              type="number"
              value={form.midterm}
              onChange={handleFormChange}
              error={formErrors.midterm}
              helperText={formErrors.midterm ? 'Required' : ''}
              fullWidth
            />

            <TextField
              label="Final"
              name="final"
              type="number"
              value={form.final}
              onChange={handleFormChange}
              error={formErrors.final}
              helperText={formErrors.final ? 'Required' : ''}
              fullWidth
            />

            <TextField
              label="Attendance (out of 200)"
              name="attendance"
              type="number"
              value={form.attendance}
              onChange={handleFormChange}
              error={formErrors.attendance}
              helperText={formErrors.attendance ? 'Required' : ''}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Result Dialog */}
      <Dialog 
        open={editDialog.open} 
        onClose={() => setEditDialog({ open: false, result: null, errors: {} })}
        fullWidth 
        maxWidth="md"
      >
        <DialogTitle>Edit Result</DialogTitle>
        <DialogContent>
          {editDialog.result && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
              <TextField
                label="Student"
                value={editDialog.result.name || ''}
                InputProps={{ readOnly: true }}
                fullWidth
              />

              <TextField
                select
                label="Course"
                value={editDialog.result.course}
                onChange={(e) =>
                  setEditDialog(prev => ({
                    ...prev,
                    result: { ...prev.result, course: e.target.value }
                  }))
                }
              >
                {courses.map(c => (
                  <MenuItem key={c._id} value={c._id}>
                    {c.CourseName}
                  </MenuItem>
                ))}
              </TextField>


              {[0, 1, 2, 3].map(i => (
                <TextField
                  key={`edit-a${i}`}
                  label={`Assignment ${i + 1}`}
                  type="number"
                  value={editDialog.result.assignments[i] || ''}
                  onChange={(e) => {
                    const newAssignments = [...editDialog.result.assignments];
                    newAssignments[i] = e.target.value;
                    setEditDialog(prev => ({
                      ...prev,
                      result: { ...prev.result, assignments: newAssignments }
                    }));
                  }}
                  error={editDialog.errors.assignments && editDialog.result.assignments[i] === ''}
                  helperText={editDialog.errors.assignments && editDialog.result.assignments[i] === '' ? 'Required' : ''}
                />
              ))}

              {[0, 1, 2, 3].map(i => (
                <TextField
                  key={`edit-q${i}`}
                  label={`Quiz ${i + 1}`}
                  type="number"
                  value={editDialog.result.quizzes[i] || ''}
                  onChange={(e) => {
                    const newQuizzes = [...editDialog.result.quizzes];
                    newQuizzes[i] = e.target.value;
                    setEditDialog(prev => ({
                      ...prev,
                      result: { ...prev.result, quizzes: newQuizzes }
                    }));
                  }}
                  error={editDialog.errors.quizzes && editDialog.result.quizzes[i] === ''}
                  helperText={editDialog.errors.quizzes && editDialog.result.quizzes[i] === '' ? 'Required' : ''}
                />
              ))}

              <TextField
                label="Midterm"
                type="number"
                value={editDialog.result.midterm || ''}
                onChange={(e) => setEditDialog(prev => ({
                  ...prev,
                  result: { ...prev.result, midterm: e.target.value }
                }))}
                error={editDialog.errors.midterm}
                helperText={editDialog.errors.midterm ? 'Required' : ''}
              />

              <TextField
                label="Final"
                type="number"
                value={editDialog.result.final || ''}
                onChange={(e) => setEditDialog(prev => ({
                  ...prev,
                  result: { ...prev.result, final: e.target.value }
                }))}
                error={editDialog.errors.final}
                helperText={editDialog.errors.final ? 'Required' : ''}
              />

              <TextField
                label="Attendance"
                type="number"
                value={editDialog.result.attendance || ''}
                onChange={(e) => setEditDialog(prev => ({
                  ...prev,
                  result: { ...prev.result, attendance: e.target.value }
                }))}
                error={editDialog.errors.attendance}
                helperText={editDialog.errors.attendance ? 'Required' : ''}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, result: null, errors: {} })}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClassResult;