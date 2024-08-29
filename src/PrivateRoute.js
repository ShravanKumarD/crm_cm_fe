import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check if the user has one of the allowed roles
  return allowedRoles.includes(user.role) ? <Outlet /> : <Navigate to="/unauthorized" />;
};

export default PrivateRoute;
