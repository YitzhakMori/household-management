import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import css from './AddFriend.module.css';

interface AddFriendProps {
  userId: string;
}

const AddFriend: React.FC<AddFriendProps> = ({ userId }) => {
  const [friendEmail, setFriendEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleAddFriend = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/House/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ friendEmail }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('החבר נוסף בהצלחה');
        setTimeout(() => {
          navigate('/Home');
        }, 2000); // מחכה 2 שניות לפני הניווט כדי להראות את הודעת ההצלחה
      } else {
        setMessage(data.message || 'שגיאה בהוספת חבר');
      }
    } catch (error) {
      console.error(error);
      setMessage('שגיאה בהוספת חבר');
    }
  };

  return (
    <div className={css.modal}>
      <div className={css.modalContent}>
        <span className={css.close} onClick={() => navigate('/Home')}>&times;</span>
        <h3>הוסף חבר</h3>
        <input
          type="email"
          placeholder="הכנס אימייל של חבר"
          value={friendEmail}
          onChange={(e) => setFriendEmail(e.target.value)}
          className={css.input}
        />
        <button onClick={handleAddFriend} className={css.button}>הוסף</button>
        {message && <p className={css.message}>{message}</p>}
      </div>
    </div>
  );
};

export default AddFriend;
