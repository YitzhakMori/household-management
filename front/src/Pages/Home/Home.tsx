import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddFriend from '../../components/AddFriend/AddFriend';
import { getUserIdFromToken } from '../../utils/utils';
import css from './Home.module.css';
import NavBar from '../../nav/Navbar';
const Home: React.FC = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [showAddFriendModal, setShowAddFriendModal] = useState(false);
    const navigate = useNavigate();
    const buttons = [
        { path: '/add-friend', label: 'הוספת חבר' },
        
      ];
    useEffect(() => {
        const userIdFromToken = getUserIdFromToken();
        setUserId(userIdFromToken);
    }, []);

    return (
        <div className={css.homePage}>
            <NavBar buttons={buttons} />
            <h1>ניהול משק בית</h1>
            <ul>
                <li onClick={() => navigate('/shopping-list')}>קניות</li>
                <li onClick={() => navigate('/tasks')}>משימות</li>
                <li onClick={() => navigate('/events')}>אירועים</li>
                <li>הוצאות והכנסות</li>
            </ul>
            {showAddFriendModal && (
                <div className={css.modal}>
                    <div className={css.modalContent}>
                        <span className={css.close} onClick={() => setShowAddFriendModal(false)}>&times;</span>
                        {userId && <AddFriend userId={userId} />}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
