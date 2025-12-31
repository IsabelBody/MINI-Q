import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  useEffect(() => {
    setIsAuthLoaded(true);
  }, [isAuthenticated, isAdmin]);

  if (!isAuthLoaded) {
    return <div>Loading...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/portal" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
