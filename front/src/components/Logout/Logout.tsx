import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LogoutProps {
  className?: string;
}

const Logout: React.FC<LogoutProps> = ({ className }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/House/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Logged out successfully');
        localStorage.removeItem('token');
        navigate('/'); // ניווט לדף הבית אחרי יציאה
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={handleLogout} className={className}>
      התנתקות
    </button>
  );
};

export default Logout;
