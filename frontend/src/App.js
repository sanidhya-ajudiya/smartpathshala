import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Staff from './pages/Staff';
import Attendance from './pages/Attendance';
import Fees from './pages/Fees';
import Layout from './components/Layout/Layout';
import Exams from './pages/Exams';
import Transport from './pages/Transport';
import Inventory from './pages/Inventory';
import Roles from './pages/Roles';
import Profile from './pages/Profile';




import { AuthProvider, useAuth } from './context/AuthContext';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';

// Protected Route Wrapper
const PrivateRoute = ({ children, permission }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Super Admin Bypass
  if (user.role_id === 1) {
    return children ? children : <Outlet />;
  }

  if (permission && user.permissions && !user.permissions.includes(permission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? children : <Outlet />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Protected Routes with Permissions */}
            <Route path="/students" element={<PrivateRoute permission="STUDENT_VIEW"><Students /></PrivateRoute>} />
            <Route path="/teachers" element={<PrivateRoute permission="TEACHER_VIEW"><Teachers /></PrivateRoute>} />
            <Route path="/staff" element={<PrivateRoute permission="USER_MANAGE"><Staff /></PrivateRoute>} />
            <Route path="/attendance" element={<PrivateRoute permission="ATTENDANCE_VIEW"><Attendance /></PrivateRoute>} />
            <Route path="/fees" element={<PrivateRoute permission="FEE_VIEW"><Fees /></PrivateRoute>} />
            <Route path="/exams" element={<PrivateRoute permission="EXAM_VIEW"><Exams /></PrivateRoute>} />
            <Route path="/transport" element={<PrivateRoute permission="TRANSPORT_VIEW"><Transport /></PrivateRoute>} />
            <Route path="/inventory" element={<PrivateRoute permission="INVENTORY_VIEW"><Inventory /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute permission="ROLE_MANAGE"><Roles /></PrivateRoute>} />
            <Route path="/profile" element={<Profile />} />

          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
