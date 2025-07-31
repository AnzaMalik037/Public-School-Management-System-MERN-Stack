//C:\Users\Anza\Desktop\school3\school\client\src\pages\Students\StudentResult.js
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, CircularProgress, Alert, Button
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

import { useEffect, useState } from 'react';
import axios from 'axios';

const StudentResult = ({ studentId, studentName }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);


  const getBarChartData = () => {
    return results.map((res) => {
      let obtained = 0;
      res.assignments.forEach(m => obtained += m);
      res.quizzes.forEach(m => obtained += m);
      obtained += res.midterm + res.final;

      return {
        course: res.courseName || 'Unnamed',
        marks: obtained
      };
    });
  };

  useEffect(() => {
    const fetchStudentResults = async () => {
      try {
        const res = await axios.get('/api/results');
        const studentResults = res.data.filter(r => r.name === studentName);
        setResults(studentResults);
      } catch (err) {
        console.error('Failed to fetch student results:', err);
        setError('Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudentResults();
    }
  }, [studentId, studentName]);

  const getStatus = (obtained, total) => {
    const percentage = (obtained / total) * 100;
    return percentage >= 50 ? 'Pass' : 'Fail';
  };

  const renderCourseResult = (result) => {
    const rows = [];

    result.assignments.forEach((mark, index) => {
      rows.push({ type: `Assignment ${index + 1}`, obtained: mark, total: 20 });
    });

    result.quizzes.forEach((mark, index) => {
      rows.push({ type: `Quiz ${index + 1}`, obtained: mark, total: 10 });
    });

    rows.push({ type: 'Midterm', obtained: result.midterm, total: 50 });
    rows.push({ type: 'Final Exam', obtained: result.final, total: 100 });

    return rows;
  };

  const calculateOverall = () => {
    let totalObtained = 0;
    let totalMarks = 0;

    results.forEach(result => {
      result.assignments.forEach(m => {
        totalObtained += m;
        totalMarks += 20;
      });
      result.quizzes.forEach(m => {
        totalObtained += m;
        totalMarks += 10;
      });
      totalObtained += result.midterm + result.final;
      totalMarks += 50 + 100;
    });

    return {
      totalObtained,
      totalMarks,
      percentage: ((totalObtained / totalMarks) * 100).toFixed(2),
      status: getStatus(totalObtained, totalMarks)
    };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || results.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">{error || 'No results available.'}</Alert>
      </Box>
    );
  }

  const overall = calculateOverall();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        Examination Results
      </Typography>

        {/* ✅ Overall Result Summary */}
      <Box sx={{ mb: 4, p: 2, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          Overall Result
        </Typography>
        <Typography>
          Total Marks Obtained: <strong>{overall.totalObtained}</strong> / {overall.totalMarks}
        </Typography>
        <Typography>
          Percentage: <strong>{overall.percentage}%</strong>
        </Typography>
        <Typography>
          Status: <Chip
            label={overall.status}
            color={overall.status === 'Pass' ? 'success' : 'error'}
            variant="outlined"
            sx={{ fontWeight: 'bold', ml: 1 }}
          />
        </Typography>
        <Box sx={{ my: 2 }}>
          <ResponsiveContainer width="50%" height={300}>
            <BarChart data={getBarChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="course" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="marks" fill="#1976d2" barSize={20} /> {/* 👈 Smaller bar width */}
            </BarChart>
          </ResponsiveContainer>
        </Box>
        <Button
          variant="outlined"
          onClick={() => setShowDetails(prev => !prev)}
          sx={{ mt: 2 }}>
          {showDetails ? 'Hide Detail' : 'Show Detail'}
        </Button>
      </Box>

      {/* Detail */}
      {showDetails && (
      <Box>
        {results.map((result) => (
          <Box key={result._id} sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
              Course: {result.courseName || 'Unknown Course'}
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Marks Obtained</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Total Marks</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {renderCourseResult(result).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.obtained}</TableCell>
                      <TableCell>{item.total}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatus(item.obtained, item.total)}
                          color={getStatus(item.obtained, item.total) === 'Pass' ? 'success' : 'error'}
                          variant="outlined"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}
      </Box>)}
    </Box>

  );
};

export default StudentResult;
