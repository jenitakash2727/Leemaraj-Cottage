import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ adminOnly = false }) => {
  const token = localStorage.getItem('access_token');
  const isAdmin = localStorage.getItem('is_admin') === 'true';
  const location = useLocation();
  
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <h1 style={{ color: '#ef4444', marginBottom: 'var(--space-4)', fontSize: 'var(--text-3xl)' }}>Unauthorized Access</h1>
        <p className="text-muted" style={{ marginBottom: 'var(--space-6)' }}>You do not have permission to view the admin dashboard.</p>
        <Link to="/" className="btn btn-primary">Return to Home</Link>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
