import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import Home from './Pages/Home/Home';
import SignUpPage from './components/SignUpPage/SignUpPage';
import VerifyEmail from './components/VerifyEmail/VerifyEmail';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import ShoppingList from './Pages/Shopping/ShoppingList';
import AdminPage from './components/Admin/Admin';
import {jwtDecode} from 'jwt-decode'; // ייבוא מתוקן
import HomeMain from './Pages/HomeMain/HomeMain';
import AddFriend from './components/AddFriend/AddFriend';
import EventsPage from "./Pages/Event/EventsPage"

// פונקציה שמבצעת בדיקה אם המשתמש הוא אדמין או לא
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

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeMain />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signUp" element={<SignUpPage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/add-friend" element={<AddFriend userId="exampleUserId" />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/admin" element={<AdminPage />} /> 

        <Route 
          path="/Home" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
   
    
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;