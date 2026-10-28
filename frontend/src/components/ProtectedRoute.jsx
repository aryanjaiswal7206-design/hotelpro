import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading HotelPro...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger shadow-sm p-4 rounded-4 max-w-md mx-auto">
          <h4 className="fw-bold mb-2">Access Denied</h4>
          <p className="text-muted">
            Your current account role (<strong>{user.role}</strong>) does not have authorization to view this managerial portal.
          </p>
          <a href="/" className="btn btn-outline-dark mt-2">Return Home</a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
