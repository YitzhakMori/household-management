// src/components/AddFriend.tsx

import React, { useState } from 'react';
import { getUserIdFromToken} from '../utils/utils';

interface AddFriendProps {
    userId: string; 
}





const AddFriend: React.FC<AddFriendProps> = () => {
    const [friendEmail, setFriendEmail] = useState('');
    const [message, setMessage] = useState('');
const userId = getUserIdFromToken()
 

    const handleAddFriend = async () => {
        if (!userId) {
            setMessage('User not logged in');
            return;
        }
        if (!friendEmail) {
            setMessage('Please enter a friend\'s email');
            return;
        }

        try {
            const response = await fetch('/api/users/add-friend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, friendEmail }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message); // הצגת הודעה למשתמש שהחבר נוספה בהצלחה
                setFriendEmail(''); // לנקות את השדה לאחר הוספה מוצלחת
            } else {
                setMessage(data.error || 'Failed to add friend');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <h2>Add a Friend</h2>
            <input
                type="email"
                placeholder="Enter friend's email"
                value={friendEmail}
                onChange={(e) => setFriendEmail(e.target.value)}
            />
            <button onClick={handleAddFriend}>Add Friend</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddFriend;
