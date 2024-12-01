import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import Home from './Pages/Home/Home';
import SignUpPage from './components/SignUpPage/SignUpPage';
import VerifyEmail from './components/VerifyEmail/VerifyEmail';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import AdminPage from './components/Admin/Admin';
import HomeMain from './Pages/HomeMain/HomeMain';
import AddFriend from './components/AddFriend/AddFriend';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ProtectedRoutee from './components/ProtectedRoute/ProtectedRoutee';
import ShoppingList from './components/ShoppingList/ShoppingList';
import EventTable from './components/Event/EventTable/EventTable';
import TaskList from './components/Task/TaskList';





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
        <Route path="/admin" element={<AdminPage />} /> 
        <Route path="/Home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute> } />
        <Route path="/shopping-list" element={<ProtectedRoutee><ShoppingList /></ProtectedRoutee>} />
        <Route path="/tasks" element={<ProtectedRoutee><TaskList /></ProtectedRoutee>} />


        <Route path="/events" element={
          <ProtectedRoutee>
            <EventTable />
          </ProtectedRoutee>
        } />
       </Routes>
    </Router>
  );
}

export default App;
