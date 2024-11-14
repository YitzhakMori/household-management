import React, { useState } from 'react';
import css from './MenuMain.module.css';
import ModelMain from '../../Models/ModelMain';
import LoginPage from '../../LoginPage/LoginPage';
import SignUpPage from '../../SignUpPage/SignUpPage';


const MenuMain = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);

  const openSignUpModal = () => setIsSignUpOpen(true);
  const closeSignUpModal = () => setIsSignUpOpen(false);

  return (
    <nav className={css.navbar}>
      <ul>
        <li>
          <button className={css.linkButton} onClick={openLoginModal}>התחברות</button>
        </li>
        <li>
          <button className={css.linkButton} onClick={openSignUpModal}>הרשמה</button>
        </li>
      </ul>
      <ModelMain isOpen={isLoginOpen} onClose={closeLoginModal}>
        <LoginPage />
      </ModelMain>
      <ModelMain isOpen={isSignUpOpen} onClose={closeSignUpModal}>
        <SignUpPage />
      </ModelMain>
    </nav>
  );
};

export default MenuMain;
