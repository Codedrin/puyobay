import React from 'react';
import { Navigate } from 'react-router-dom';

const PropertyAuth = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
  
    if (!user) {
      // If no user is found in localStorage, redirect to the login page
      return <Navigate to="/" replace />;
    }
  
    // If the user is authenticated, render the children components (protected page)
    return children;
  };
export default PropertyAuth