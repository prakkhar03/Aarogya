import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Protects routes by role.
 * - requiredRole = 'patient' | 'doctor' | null (any authenticated user)
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // Still checking token

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate home for their role
    const fallback = user.role === 'doctor' ? '/doctor' : '/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default ProtectedRoute;
