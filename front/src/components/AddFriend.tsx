// src/components/AddFriend.tsx
import React, { useState } from 'react';

interface AddFriendProps {
    userId: string;
}

const AddFriend: React.FC<AddFriendProps> = ({ userId }) => {
   
    
    
    const [friendEmail, setFriendEmail] = useState('');
    const [message, setMessage] = useState('');

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
            } else {
                setMessage(data.message || 'שגיאה בהוספת חבר');
            }
        } catch (error) {
            console.error(error);
            setMessage('שגיאה בהוספת חבר');
        }
    };

    return (
        <div>
            <h3>הוסף חבר</h3>
            <input
                type="email"
                placeholder="הכנס אימייל של חבר"
                value={friendEmail}
                onChange={(e) => setFriendEmail(e.target.value)}
            />
            <button onClick={handleAddFriend}>הוסף</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddFriend;
