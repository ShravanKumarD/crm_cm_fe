import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';


const PrivateRoute = ({ allowedRoles }) => {
  let token = localStorage.getItem('token');
  let user;
  if (token) {
      try {
          const decodedToken = jwtDecode(token);
          user = decodedToken.user;
      } catch (error) { 
          console.error('Invalid token:', error);
          return <Navigate to="/login" />;
      }
  }
  return allowedRoles.includes(user?.role) ? <Outlet /> : <Navigate to="/unauthorized" />;
};

export default PrivateRoute;
