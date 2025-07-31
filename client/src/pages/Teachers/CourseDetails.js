//C:\Users\Anza\Desktop\school3\school\client\src\pages\Teachers\CourseDetails.js
import {
  Box,Typography,Tabs, Tab,Paper, List, ListItem,
  ListItemText, Divider,TextField, IconButton
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const CourseDetails = () => {
  const { courseCode } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [editingAssignmentIndex, setEditingAssignmentIndex] = useState(null);
  const [courseData, setCourseData] = useState({
    code: courseCode,
    name: '',
    syllabus: [],
    assignments: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`/api/course/${encodeURIComponent(courseCode)}`);
        const course = response.data;
        setCourseData({
          code: courseCode,
          name: course.CourseName,
          syllabus: course.Syllabus.split('\n').filter(item => item.trim() !== ''),
          assignments: course.assignments || []
        });

      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseCode]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAssignmentEdit = (index, value) => {
    const updated = [...courseData.assignments];
    updated[index].due = value;
    setCourseData(prev => ({ ...prev, assignments: updated }));
  };

  if (loading) {
    return <Typography>Loading course details...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {courseData.code}: {courseData.name}
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Syllabus" />
        <Tab label="Assignments" />
      </Tabs>

      {/* ===== SYLLABUS ===== */}
      {activeTab === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Syllabus
          </Typography>
          <List>
            {courseData.syllabus.length > 0 ? (
              courseData.syllabus.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText primary={item} />
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No syllabus available for this course.
              </Typography>
            )}
          </List>
        </Paper>
      )}

      {/* ===== ASSIGNMENTS ===== */}
      {activeTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Assignments
          </Typography>
          <List>
            {courseData.assignments.map((assignment, index) => (
              <div key={index}>
                <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <ListItemText primary={assignment.name} />

                  {editingAssignmentIndex === index ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TextField
                        label="Due Date"
                        type="date"
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        value={assignment.due}
                        onChange={(e) => handleAssignmentEdit(index, e.target.value)}
                      />
                      <IconButton
                        onClick={async () => {
                          try {
                            await axios.put(`/api/course/${courseCode}/assignment/${index}`, {
                              due: courseData.assignments[index].due
                            });
                            setEditingAssignmentIndex(null);
                          } catch (err) {
                            console.error('Failed to update assignment:', err);
                            alert('Error updating assignment. Please try again.');
                          }
                        }} color="primary"
                      > <SaveIcon /></IconButton>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">
                        Due: {assignment.due}
                      </Typography>
                      <IconButton onClick={() => setEditingAssignmentIndex(index)} color="primary">
                        <EditIcon />
                      </IconButton>
                    </Box>
                  )}

                  {/* Submissions List */}
                  <Box sx={{ width: '100%', mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Submissions:
                    </Typography>
                    <List sx={{ pl: 2 }}>
                      {assignment.submissions && assignment.submissions.length > 0 ? (
                        assignment.submissions.map((sub, i) => (
                          <ListItem key={i} sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 1 }}>
                            <Typography variant="body2">Student Name: {sub.studentName}</Typography>{/*Student Id: {sub.studentId}*/}
                            
                            <a href={`${process.env.REACT_APP_API_URL}${sub.fileUrl}`}
                              target="_blank" rel="noopener noreferrer" >
                              View Submission
                            </a>

                            <Typography variant="caption" color="textSecondary">
                              Submitted At: {new Date(sub.submittedAt).toLocaleString()}
                            </Typography>
                          </ListItem>
                        ))
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          No submissions yet.
                        </Typography>
                      )}
                    </List>
                  </Box>
                </ListItem>
                {index < courseData.assignments.length - 1 && <Divider />}
              </div>
            ))}
        
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default CourseDetails;