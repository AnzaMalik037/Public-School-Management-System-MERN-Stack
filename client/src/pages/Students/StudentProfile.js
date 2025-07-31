//C:\Users\Anza\Desktop\school3\school\client\src\pages\Students\StudentProfile.js
import { 
  Box, Typography, Button, Paper, Table, TableBody, Link,
  TableCell, TableContainer, TableRow, CircularProgress
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';

const StudentProfile = () => {
  const [classData, setClassData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [receipt, setReceipt] = useState(null);

const handleUpload = async () => {
  if (!receipt || !studentData) return;

  const formData = new FormData();
  formData.append('receipt', receipt);
  formData.append('studentId', studentData.studentId);
  formData.append('studentName', studentData.name);

  try {
    const res = await fetch('/api/upload-receipt', {
      method: 'POST', body: formData,});

    if (res.ok) {
      alert("Receipt uploaded successfully!");
      setReceipt(null); // Reset file input
    } else {
      alert("Upload failed.");
    }
  } catch (err) {
    console.error("Upload error:", err);
    alert("Error uploading receipt.");
  }
};


  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const auth = JSON.parse(localStorage.getItem('auth')) || {};
        const studentName = auth.name || auth.user?.name;

        if (!studentName) {
          throw new Error('Student name not found');
        }

        // Get student by name
        const studentRes = await axios.get(`/api/students/byname?name=${encodeURIComponent(studentName)}`);
        const student = studentRes.data;
        setStudentData(student);

        // Get class data using student.classID and classSection
        const classRes = await axios.get(`/api/class/byclassid/${student.classID}?section=${student.classSection}`);
        setClassData(classRes.data);
        }
        catch (err) {
          console.error("Error fetching student data:", err);
          setError('Failed to load student profile');
        } 
        finally {
          setLoading(false);
        }
    };

    fetchStudentData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
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

  if (!studentData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>No student data found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h4">Student Profile</Typography>
      </Box>

      {/* Profile Information Table */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table sx={{ minWidth: 650 }} aria-label="profile table">
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Student Name</TableCell>
              <TableCell>{studentData.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Student ID</TableCell>
              <TableCell>{studentData.studentId}</TableCell>
            </TableRow>            
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Class</TableCell>
              <TableCell>{studentData.classID}{studentData.classSection}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Time Table</TableCell>
              <TableCell>
                {classData?.timetableUrl ? (
                  <Link 
                    href={`${process.env.REACT_APP_API_URL}${classData.timetableUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    sx={{ textDecoration: 'underline', color: 'primary.main' }}
                  > View </Link>
                ) : (
                  'No timetable available'
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Father/Guardian</TableCell>
              <TableCell>{studentData.fatherGuardian}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Email Address</TableCell>
              <TableCell>{studentData.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Emergency Contact</TableCell>
              <TableCell>{studentData.emergencyContact}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Home Address</TableCell>
              <TableCell>{studentData.address}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Blood Group</TableCell>
              <TableCell>{studentData.bloodGroup}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Disabilities</TableCell>
              <TableCell>{studentData.disabilities}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>


      {/* Upload Fee Receipt */}
      <section className='fee' sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Upload Fee Receipt here after payment
        </Typography>

        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setReceipt(e.target.files[0])}
          style={{ marginBottom: '1rem' }}
        />

        <Button 
          variant="contained" 
          onClick={handleUpload}
          disabled={!receipt}
        >
          Upload Receipt
        </Button>
      </section>


    </Box>
  );
};

export default StudentProfile;