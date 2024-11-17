import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import Home from"./Pages/Home/Home"
import SignUpPage from './components/SignUpPage/SignUpPage';
import VerifyEmail from './components/VerifyEmail/VerifyEmail';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import ShoppingList from './Pages/Shopping/ShoppingList';
import MainHome from './Pages/MainHome/mainHome';

function App() {
  return (
    <Router>
         <Routes>
        <Route path="/" element={<MainHome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signUp" element={<SignUpPage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/loginPage" element={<LoginPage />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/shopping" element={<ShoppingList userId="USER_ID_HERE" />} />
         
         
         </Routes>
    </Router>
  );
}

export default App;
