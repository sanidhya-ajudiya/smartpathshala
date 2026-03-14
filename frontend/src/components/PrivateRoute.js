import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, permission }) => {
    const { user, token, hasPermission, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (permission && !hasPermission(permission)) {
        return <Navigate to="/dashboard" replace />; // Redirect if unauthorized
    }

    return children;
};

export default PrivateRoute;
