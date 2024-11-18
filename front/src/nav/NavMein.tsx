import React from 'react';
import { Link } from 'react-router-dom';
import css from './NavMein.module.css';

const NavBeforeLogin: React.FC = () => {
  return (
    <nav className={css.nav}>
      <ul className={css.nav}>
        <li>
          <Link to="/login">התחברות</Link>
        </li>
        <li>
          <Link to="/signUp">הרשמה</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBeforeLogin;
