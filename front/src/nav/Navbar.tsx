import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import Logout from '../components/Logout';  // ייבוא רכיב ה-Logout

interface Button {
  path?: string;
  label: string;
  onClick?: () => void;
}

interface NavBarProps {
  buttons: Button[];
}

const NavBar: React.FC<NavBarProps> = ({ buttons }) => {
  return (
    <nav className={styles.navbar}>
      <ul>
        {buttons.map((button, index) => (
          <li key={index}>
            {button.path ? (
              <Link to={button.path} className={styles.link}>
                {button.label}
              </Link>
            ) : (
              <button onClick={button.onClick} className={styles.link}>
                {button.label}
              </button>
            )}
          </li>
        ))}
        <button>
        <li>
          <Logout className={styles.link}/> {/* כפתור יציאה */} 
        </li>
        </button>
      </ul>
    </nav>
  );
};

export default NavBar;
