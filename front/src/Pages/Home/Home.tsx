// src/pages/HomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddFriend from '../../components/AddFriend';
import { useState, useEffect } from 'react';
import { getUserIdFromToken } from '../../utils/utils';

const HomePage: React.FC = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userIdFromToken = getUserIdFromToken();
        console.log("User ID from token:", userIdFromToken); // הוסף שורה זו


        setUserId(userIdFromToken);

    }, []);
    useEffect(() => {
        console.log({userId});
    }, [userId]);

    return (
        <div className="home-page">
            <h1>ניהול משק בית</h1>
            <ul>
                <li onClick={() => navigate('/shopping')}>קניות</li>

                <li>משימות</li>
                <li>אירועים</li>
                <li>הוצאות והכנסות</li>
            </ul>


            {userId && <AddFriend userId={userId} />}

        </div>
    );
};

export default HomePage;
