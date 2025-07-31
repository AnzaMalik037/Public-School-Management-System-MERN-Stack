// C:\Users\Anza\Desktop\school3\school\client\src\pages\Students\CourseDetails.js
import {
  Box, Typography, Tabs, Tab, Paper, List,
  ListItem, ListItemText, Divider, Button
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const CourseDetails = () => {
  const { courseCode } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [files, setFiles] = useState({});
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Get student ID from localStorage
  const storedStudent = JSON.parse(localStorage.getItem('student'));
  const studentId = storedStudent?._id;

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await axios.get(`/api/course/${courseCode}`);
        setCourseData(res.data);
      } catch (err) {
        console.error("Failed to load course", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseCode]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFileChange = (event, assignmentName) => {
    setFiles(prev => ({ ...prev, [assignmentName]: event.target.files[0] }));
  };

  const handleSubmit = async (assignmentName, index) => {
    const file = files[assignmentName];
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('studentId', studentId); // ✅ now dynamic

    try {
      await axios.post(
        `/api/course/${courseData.CourseId}/assignment/${index}/submit`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      alert('Submitted successfully!');
      setFiles(prev => ({ ...prev, [assignmentName]: null }));
    } catch (err) {
      console.error('Submission error:', err);
      alert('Submission failed.');
    }
  };

  const isPastDue = (dueDateStr) => {
    const now = new Date();
    const dueDate = new Date(dueDateStr + 'T23:59:59');
    return now > dueDate;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading course...</Typography>
      </Box>
    );
  }

  if (!courseData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Failed to load course details.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {courseData.code}: {courseData.name}
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Syllabus" />
        <Tab label="Assignments" />
        <Tab label="Instructor Profile" />
      </Tabs>

      {activeTab === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Course Syllabus</Typography>
          <List>
            {courseData.Syllabus?.split('\n').map((line, index) => (
              <ListItem key={index}><ListItemText primary={line} /></ListItem>
            ))}
          </List>
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Assignments</Typography>
          <List>
            {courseData.assignments.map((assignment, index) => {
              const isLate = isPastDue(assignment.due);
              return (
                <div key={index}>
                  <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <ListItemText
                      primary={assignment.name}
                      secondary={`Due: ${assignment.due}`}
                    />
                    {isLate ? (
                      <Typography color="error" sx={{ mt: 1 }}>
                        Submission closed
                      </Typography>
                    ) : (
                      <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, assignment.name)}
                        />
                        <Button variant="contained" onClick={() => handleSubmit(assignment.name, index)}>
                          Submit
                        </Button>
                      </Box>
                    )}
                  </ListItem>
                  {index < courseData.assignments.length - 1 && <Divider />}
                </div>
              );
            })}
          </List>
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Instructor Profile</Typography>
          {courseData.AssignedTeachers?.length > 0 ? (
            courseData.AssignedTeachers.map((teacher, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Typography><strong>Name:</strong> {teacher.name}</Typography>
                <Typography><strong>Email:</strong> {teacher.email}</Typography>
                <Typography><strong>Phone:</strong> {teacher.phone}</Typography>
                <Typography><strong>Office:</strong> {teacher.office}</Typography>
                <Typography><strong>Office Hours:</strong> {teacher.hours}</Typography>
                <Typography><strong>Department:</strong> {teacher.department}</Typography>
                <Typography><strong>Qualification:</strong> {teacher.qualification}</Typography>
                <Typography><strong>Specialization:</strong> {teacher.specialization}</Typography>
              </Box>
            ))
          ) : (
            <Typography color="textSecondary">No instructor data available.</Typography>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default CourseDetails;
