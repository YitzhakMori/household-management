import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';



import LoginPage from './components/LoginPage';
import Home from './Pages/Home';
import SignUpPage from './components/SignUpPage';
import VerifyEmail from './components/VerifyEmail';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import AdminPage from './components/Admin';
import HomeMain from './Pages/HomeMain';
import AddFriend from './components/AddFriend';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ProtectedRoutee from './components/ProtectedRoute/ProtectedRoutee';
import ShoppingList from './components/ShoppingList';
import Dashboard from './components/Transaction/Dashboard';

import EventTable from './components/EventTable';
import TaskList from './components/TaskList';
import FriendRequests from './components/FriendRequests';






function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>

    <Router>
      <Routes>
        <Route path="/" element={<HomeMain />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signUp" element={<SignUpPage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/add-friend" element={<AddFriend />} />
        <Route path="/admin" element={<AdminPage />} /> 
        <Route path="/Home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute> } />
        <Route path="/shopping-list" element={<ProtectedRoutee><ShoppingList /></ProtectedRoutee>} />

        <Route path="/tasks" element={<ProtectedRoutee><TaskList /></ProtectedRoutee>} />
        <Route path="/friend-requests" element={<ProtectedRoutee><FriendRequests /></ProtectedRoutee>} />
        <Route path="/dashboard" element={<Dashboard /> } />





        <Route path="/events" element={
          <ProtectedRoutee>
            <EventTable />
          </ProtectedRoutee>
        } />
       </Routes>
    </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
