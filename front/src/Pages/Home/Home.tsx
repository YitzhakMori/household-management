import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddFriend from '../../components/AddFriend/AddFriend';
import { getUserIdFromToken } from '../../utils/utils';
import NavBar from '../../nav/Navbar';

const Home: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const navigate = useNavigate();
  
  const menuItems = [
    { 
      path: '/shopping-list', 
      label: 'קניות', 
      icon: '🛒', 
      color: 'bg-blue-100 hover:bg-blue-200 text-blue-800',
      stats: { count: '8', text: 'פריטים ברשימה' }
    },
    { 
      path: '/tasks', 
      label: 'משימות', 
      icon: '✓', 
      color: 'bg-green-100 hover:bg-green-200 text-green-800',
      stats: { count: '5', text: 'משימות להיום' }
    },
    { 
      path: '/events', 
      label: 'אירועים', 
      icon: '📅', 
      color: 'bg-purple-100 hover:bg-purple-200 text-purple-800',
      stats: { count: '2', text: 'אירועים קרובים' }
    },
    { 
      path: '', 
      label: 'הוצאות והכנסות', 
      icon: '💰', 
      color: 'bg-orange-100 hover:bg-orange-200 text-orange-800',
      stats: { count: '₪3,500', text: 'הוצאות החודש' }
    },
  ];

  const quickStats = [
    { label: 'הוצאות השבוע', value: '₪850', trend: '+12%', icon: '📈' },
    { label: 'חברים פעילים', value: '4', trend: 'חדש', icon: '👥' },
    { label: 'התראות', value: '3', trend: 'לא נקראו', icon: '🔔' }
  ];

  useEffect(() => {
    const userIdFromToken = getUserIdFromToken();
    setUserId(userIdFromToken);
  }, []);

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 flex flex-col">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-white mb-6 md:mb-0">
              <h1 className="text-4xl font-bold mb-2">ניהול משק בית</h1>
              <p className="text-blue-100">ברוך הבא! נהל את משק הבית שלך בקלות ויעילות</p>
            </div>
            <button
              onClick={() => setShowAddFriendModal(true)}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow 
                hover:shadow-lg hover:scale-105 hover:bg-blue-50 
                transition-all duration-300 ease-in-out
                flex items-center space-x-2 space-x-reverse"
            >
              <span className="text-xl">👥</span>
              <span className="font-medium">הוספת חבר</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4 flex justify-between items-center
              hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl mb-1">{stat.icon}</span>
                <span className="text-sm text-gray-500">{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <div
              key={item.label}
              onClick={() => item.path && navigate(item.path)}
              className={`${item.color} rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02]`}
            >
              <div className="p-6">
                <div className="flex items-center space-x-4 space-x-reverse mb-4">
                  <div className="bg-white p-3 rounded-full shadow-sm text-2xl">
                    {item.icon}
                  </div>
                  <span className="text-lg font-medium">{item.label}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-2xl font-bold">{item.stats.count}</p>
                  <p className="text-sm text-gray-600">{item.stats.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showAddFriendModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowAddFriendModal(false)}
          />
          
          <div className="bg-white rounded-lg shadow-xl w-96 p-6 relative z-50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold hover:text-blue-600 transition-colors">הוסף חבר</h2>
              <button
                onClick={() => setShowAddFriendModal(false)}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 
                  w-8 h-8 flex items-center justify-center rounded-full 
                  transition-all duration-300 text-xl font-bold"
              >
                ×
              </button>
            </div>
            
            {userId && <AddFriend  />}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-8 space-x-reverse mb-6">
            <button className="flex items-center text-gray-600 hover:text-blue-600 
              hover:scale-105 transition-all duration-300">
              <span className="text-xl ml-2">⚙️</span>
              <span>הגדרות</span>
            </button>
            <button className="flex items-center text-gray-600 hover:text-blue-600 
              hover:scale-105 transition-all duration-300">
              <span className="text-xl ml-2">📝</span>
              <span>מדריך</span>
            </button>
          </div>

          <div className="text-center text-sm text-gray-500 hover:text-gray-700 
            transition-colors duration-300">
            <p>© {new Date().getFullYear()} ניהול משק בית - גרסה 1.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;