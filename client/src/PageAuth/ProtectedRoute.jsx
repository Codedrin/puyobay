import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Check if the user is logged in by verifying localStorage or token presence
    const user = JSON.parse(localStorage.getItem('user'));
  
    if (!user) {
      // If the user is not logged in, redirect them to the login page
      return <Navigate to="/" replace />;
    }
  
    // If the user is logged in, render the protected page content
    return children;
  };
  

export default ProtectedRoute