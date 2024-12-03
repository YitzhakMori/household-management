import React, { useEffect, useState } from 'react';
import { getFriendRequests, acceptFriendRequest, rejectFriendRequest } from '../../api/friendRequests';

interface FriendRequest {
    _id: string;
    sender: {
        name: string;
        email: string;
    };
}

const FriendRequests: React.FC = () => {
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const requests = await getFriendRequests();
                if (requests.length === 0) {
                    setMessage('אין בקשות חברות ממתינות');
                } else {
                    setFriendRequests(requests);
                }
            } catch (error) {
                setMessage('שגיאה בהבאת בקשות חברים');
            }
        };

        fetchFriendRequests();
    }, []);

    const handleAccept = async (requestId: string) => {
        try {
            const result = await acceptFriendRequest(requestId);
            setMessage(result.message);
            setFriendRequests(friendRequests.filter((request) => request._id !== requestId)); // הסרת הבקשה
        } catch (error) {
            setMessage('שגיאה בהסכמה');
        }
    };

    const handleReject = async (requestId: string) => {
        try {
            const result = await rejectFriendRequest(requestId);
            setMessage(result.message);
            setFriendRequests(friendRequests.filter((request) => request._id !== requestId)); // הסרת הבקשה
        } catch (error) {
            setMessage('שגיאה בדחיה');
        }
    };

    return (
        <div>
            <h3>בקשות חברות</h3>
            {message && <p>{message}</p>}
            <ul>
                {friendRequests.map((request) => (
                    <li key={request._id}>
                        <span>{request.sender.name} ({request.sender.email})</span>
                        <button onClick={() => handleAccept(request._id)}>אשר</button>
                        <button onClick={() => handleReject(request._id)}>דחה</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FriendRequests;
