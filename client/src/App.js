// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import StudentDashboard from './pages/Students/StudentDashboard';
import TeacherDashboard from './pages/Teachers/TeacherDashboard';
import AdminDashboard from './pages/Admin/Admindashboard';
import TeacherManagement from './pages/Admin/TeacherManagement';
import StCourseDetails from './pages/Students/CourseDetails';
import TeCourseDetails from './pages/Teachers/CourseDetails';
import Navbar from './components/Navbar';
import './App.css'

// Simple route protection
const ProtectedRoute = ({ children }) => {
  const auth = JSON.parse(localStorage.getItem('auth'));
  return auth?.isAuthenticated ? children : <Navigate to="/auth" replace />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/admin/teachers" element={<TeacherManagement />} />
        <Route 
          path="/student/dashboard" 
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/dashboard" 
          element={
            <ProtectedRoute>
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/courses/:courseCode" 
          element={
            <ProtectedRoute>
              <StCourseDetails />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/teacher/courses/:courseCode" 
          element={
            <ProtectedRoute>
              <TeCourseDetails />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}

export default App;