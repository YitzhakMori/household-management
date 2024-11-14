// src/components/NavBar.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import css from './MenuHome.module.css';
import ModelHome from "../../Models/ModelHome"
import AddFriend from '../../AddFriend/AddFriend';

const MenuHome: React.FC = () => {
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const navigate = useNavigate();
  const userId = "USER_ID_HERE"; // ניתן להחליף בקוד דינמי כדי לקבל את ה-userId

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
        localStorage.removeItem('token'); // הסרת הטוקן מהמקומי
        navigate('/'); // נניח שיש לך עמוד התחברות
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const openAddFriendModal = () => setIsAddFriendOpen(true);
  const closeAddFriendModal = () => setIsAddFriendOpen(false);

  return (
    <nav className={css.navbar}>
      <ul>
        <li>
          <button className={css.linkButton} onClick={handleLogout}>התנתקות</button>
        </li>
        <li>
          <button className={css.linkButton} onClick={openAddFriendModal}>הוספת חבר</button>
        </li>
      </ul>
      <ModelHome isOpen={isAddFriendOpen} onClose={closeAddFriendModal}>
        <AddFriend userId={userId} />
      </ModelHome>
    </nav>
  );
};

export default MenuHome;
