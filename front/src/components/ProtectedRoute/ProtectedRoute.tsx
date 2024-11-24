import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';



interface DecodedToken {
    user_id: string;
    role: string;
    exp: number; // Timestamp של פקיעת התוקף
  }
  



const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
  
    if (!token) {
      console.error('No token found, redirecting to login.');
      return <Navigate to="/" />;
    }
  
    try {
      const decoded: DecodedToken = jwtDecode(token);
      console.log('Decoded token:', decoded);
  
      const currentTime = Math.floor(Date.now() / 1000); // זמן נוכחי בשניות
      if (!decoded.exp || decoded.exp < currentTime) {
        console.error('Token has expired or is invalid, redirecting to login.');
        return <Navigate to="/" />;
      }
  
      if (decoded.role === 'admin') {
        console.log('User is admin, displaying admin page.');
        return children;
      } else {
        console.warn('User is not admin, redirecting to Home.');
        return <Navigate to="/Home" />;
      }
    } catch (error) {
      console.error('Invalid token, redirecting to login.', error);
      return <Navigate to="/" />;
    }
  };


export default ProtectedRoute;
