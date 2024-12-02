import React, { useState } from 'react';
import { sendFriendRequest } from '../../api/friendRequests';

const AddFriend: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const handleAddFriend = async () => {
        if (!email) {
            setMessage('יש להזין מייל');
            return;
        }

        try {
            const result = await sendFriendRequest({ recipientEmail: email });
            setMessage(result.message); // הצגת הודעה על הצלחה או שגיאה
        } catch (error) {
            setMessage('שגיאה בהוספת חבר');
        }
    };

    return (
        <div>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="הכנס מייל של חבר"
            />
            <button onClick={handleAddFriend}>הוסף חבר</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddFriend;
