import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AddFriend from '../components/AddFriend/AddFriend';
import css from './NavHome.module.css';

const NavAfterLogin: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Logged out successfully');
        localStorage.removeItem('token');
        navigate('/'); // נניח שיש לך עמוד התחברות
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <nav className={css.nav}>
      <ul>
        <li>
          <Link to="/add-friend">הוספת חבר</Link>
        </li>
        <li>
          <button onClick={handleLogout}>התנתקות</button>
        </li>
      </ul>
    </nav>
  );
};

export default NavAfterLogin;
