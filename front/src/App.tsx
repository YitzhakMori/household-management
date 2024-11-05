import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import LoginPage from './Pages/LoginPage/LoginPage';
import Home from './Pages/Home/Home';
import SignUpPage from './Pages/SignUpPage/SignUpPage';
import VerifyEmail from './Pages/VerifyEmail/VerifyEmail';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword';
import ResetPassword from './Pages/ResetPassword/ResetPassword';



function App() {
  return (
    <Router>
         <Routes>
         <Route  path='/' Component={LoginPage}/>
         <Route path="/signUp" Component={SignUpPage}/>
         <Route  path='/verify-email' Component={VerifyEmail}/>
         <Route  path='/forgot-password' Component={ForgotPassword}/>
         <Route  path='/forgot-password' Component={ForgotPassword}/>
         <Route  path='/reset-password/:token' Component={ResetPassword}/>
         <Route  path='/Home' Component={Home}/>
         
         
         </Routes>
    </Router>
  );
}

export default App;
