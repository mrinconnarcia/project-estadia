import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>; // O un componente de carga
  }
  
  return user ? children : <Navigate to="/login" />;
};
export default PrivateRoute;