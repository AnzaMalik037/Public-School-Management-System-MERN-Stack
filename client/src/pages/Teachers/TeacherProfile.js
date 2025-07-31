// src/pages/Teachers/TeacherProfile.js
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Link
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';

const TeacherProfile = () => {
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        const auth = JSON.parse(localStorage.getItem('auth')) || {};
        const teacherName = auth.name || auth.user?.name;

        if (!teacherName) {
          throw new Error('Teacher name not found');
        }

        const res = await axios.get(`/api/teachers/byname?name=${encodeURIComponent(teacherName)}`);
        setTeacherData(res.data);
      } catch (err) {
        console.error('Failed to load teacher profile:', err);
        setError('Failed to load teacher profile');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !teacherData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error || 'No teacher data available.'}</Typography>
        <Button variant="outlined" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Teacher Profile
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Full Name</TableCell>
              <TableCell>{teacherData.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Teacher ID</TableCell>
              <TableCell>{teacherData.teacherId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Timetable</TableCell>
              <TableCell>
                {teacherData.timetableUrl ? (
                  <Link
                    href={`${process.env.REACT_APP_API_URL}${teacherData.timetableUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textDecoration: 'underline', color: 'primary.main' }}
                  >
                    View
                  </Link>
                ) : (
                  'No timetable available'
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
              <TableCell>{teacherData.department}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Email Address</TableCell>
              <TableCell>{teacherData.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Phone Number</TableCell>
              <TableCell>{teacherData.phone}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Office Room</TableCell>
              <TableCell>{teacherData.office}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Office Hours</TableCell>
              <TableCell>{teacherData.hours}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Qualification</TableCell>
              <TableCell>{teacherData.qualification}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Specialization</TableCell>
              <TableCell>{teacherData.specialization}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TeacherProfile;
