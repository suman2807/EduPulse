import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CourseDetails from './pages/CourseDetails';
import CourseViewer from './pages/CourseViewer';
import BrowseCourses from './pages/BrowseCourses';
import CreateCourse from './pages/CreateCourse';
import EditCourse from './pages/EditCourse';
import LoadingSpinner from './components/LoadingSpinner';

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ 
  children, 
  roles 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            {user?.role === 'student' && <StudentDashboard />}
            {user?.role === 'instructor' && <InstructorDashboard />}
            {user?.role === 'admin' && <AdminDashboard />}
          </ProtectedRoute>
        } />
        
        <Route path="/courses" element={
          <ProtectedRoute>
            <BrowseCourses />
          </ProtectedRoute>
        } />
        
        <Route path="/courses/:id" element={
          <ProtectedRoute>
            <CourseDetails />
          </ProtectedRoute>
        } />
        
        <Route path="/learn/:courseId" element={
          <ProtectedRoute roles={['student']}>
            <CourseViewer />
          </ProtectedRoute>
        } />
        
        <Route path="/create-course" element={
          <ProtectedRoute roles={['instructor', 'admin']}>
            <CreateCourse />
          </ProtectedRoute>
        } />
        
        <Route path="/edit-course/:id" element={
          <ProtectedRoute roles={['instructor', 'admin']}>
            <EditCourse />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;