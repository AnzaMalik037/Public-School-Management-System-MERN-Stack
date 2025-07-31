//C:\Users\Anza\Desktop\school3\school\client\src\pages\Auth.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, TextField, Button, Typography, Select,
  MenuItem, FormControl, InputLabel, Paper
} from '@mui/material';

const Auth = () => {
  const [role, setRole] = useState('student'); // student | teacher | admin
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      let response;

      if (role === 'admin') {
        if (!formData.email || !formData.password) {
          setError('Please enter email and password for admin login.');
          return;
        }

        response = await axios.post(`/api/admin/login`, {
          email: formData.email,
          password: formData.password
        });

        const { token, admin } = response.data;
        localStorage.setItem('auth', JSON.stringify({
          role,
          name: admin.email,
          isAuthenticated: true,
          token
        }));

        navigate('/admin/dashboard');
      } else {
        if (!formData.email || !formData.password) {
          setError('Please enter both name and password');
          return;
        }

        const endpoint = role === 'student' ? '/api/students/login' : '/api/teachers/login';

        response = await axios.post(endpoint, {
          name: formData.email,
          password: formData.password
        });

        const user = response.data;
        localStorage.setItem('student', JSON.stringify(user));

        if (!user || !user.name) {
          setError('Name not found. Please contact admin.');
          return;
        }

        localStorage.setItem('auth', JSON.stringify({
          role,
          name: user.name,
          isAuthenticated: true
        }));

        navigate(`/${role}/dashboard`);
        //console.log("Logged in user:", user); // make sure you see `_id` here

      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || 'Login failed.');
    }
  };

  return (
    <Box sx={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: '85vh', backgroundColor: '#f5f5f5'
    }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: '400px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>I am a...</InputLabel>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              label="I am a..."
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label={role === 'admin' ? 'Email' : 'Full Name'}
            name="email"
            type={role === 'admin' ? 'email' : 'text'}
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 3 }}
            size="large"
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Auth;
