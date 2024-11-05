import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import LoginPage from './Pages/LoginPage/LoginPage';
import Home from './Pages/Home/Home';
import SignUpPage from './Pages/SignUpPage/SignUpPage';
import VerifyEmail from './Pages/VerifyEmail/VerifyEmail';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword';



function App() {
  return (
    <Router>
         <Routes>
         <Route  path='/' Component={LoginPage}/>
         <Route path="/signUp" Component={SignUpPage}/>
         <Route  path='/verify-email' Component={VerifyEmail}/>
         <Route  path='/forgot-password' Component={ForgotPassword}/>
         <Route  path='/Home' Component={Home}/>
         
         
         </Routes>
    </Router>
  );
}

export default App;
