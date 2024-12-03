import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddFriend from '../../components/AddFriend/AddFriend';
import { getUserIdFromToken } from '../../utils/utils';
import { getFriendRequests, acceptFriendRequest, rejectFriendRequest } from '../../api/friendRequests';
// הוספת הממשק של בקשת חבר
interface FriendRequest {
    _id: string;
    sender: {
      name: string;
      email: string;
    };
  }

const Home: React.FC = () => {

    const [userId, setUserId] = useState<string | null>(null);



  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);
  const [alert, setAlert] = useState<{message: string; type: 'success' | 'error'} | null>(null);
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
    loadFriendRequests();
  }, []);

  const showAlert = (message: string, type: 'success' | 'error') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const loadFriendRequests = async () => {
    try {
      const requests = await getFriendRequests();
      setFriendRequests(requests);
    } catch (error) {
      console.error('Error loading friend requests:', error);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await acceptFriendRequest(requestId);
      setFriendRequests(prevRequests => 
        prevRequests.filter(request => request._id !== requestId)
      );
      showAlert('בקשת החברות אושרה בהצלחה', 'success');
    } catch (error) {
      showAlert('שגיאה באישור הבקשה', 'error');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectFriendRequest(requestId);
      setFriendRequests(prevRequests => 
        prevRequests.filter(request => request._id !== requestId)
      );
      showAlert('בקשת החברות נדחתה', 'success');
    } catch (error) {
      showAlert('שגיאה בדחיית הבקשה', 'error');
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 flex flex-col">
      {/* Alert */}
      {alert && (
        <div 
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 
            ${alert.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
            }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">
              {alert.type === 'success' ? '✓' : '⚠️'}
            </span>
            <span className="font-medium">{alert.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-white mb-6 md:mb-0">
              <h1 className="text-4xl font-bold mb-2">ניהול משק בית</h1>
              <p className="text-blue-100">ברוך הבא! נהל את משק הבית שלך בקלות ויעילות</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Friend Requests Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsRequestsOpen(!isRequestsOpen)}
                  className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors relative"
                >
                  <span className="text-2xl">🔔</span>
                  {friendRequests.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">
                      {friendRequests.length}
                    </span>
                  )}
                </button>

                {isRequestsOpen && (
                  <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b">
                      <h3 className="text-lg font-semibold">בקשות חברות</h3>
                      {friendRequests.length === 0 && (
                        <p className="text-gray-500 text-sm mt-2">אין בקשות חברות ממתינות</p>
                      )}
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {friendRequests.map((request) => (
                        <div 
                          key={request._id}
                          className="p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                        >
                          <div className="flex items-center mb-2">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                              {request.sender.name.charAt(0)}
                            </div>
                            <div className="mr-3 flex-1">
                              <div className="font-medium">{request.sender.name}</div>
                              <div className="text-sm text-gray-500">{request.sender.email}</div>
                            </div>
                          </div>
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              onClick={() => handleAcceptRequest(request._id)}
                              className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              אשר
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request._id)}
                              className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              דחה
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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

              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/';
                }}
                className="bg-red-500 text-white px-6 py-3 rounded-lg shadow 
                  hover:shadow-lg hover:scale-105 hover:bg-red-600
                  transition-all duration-300 ease-in-out
                  flex items-center space-x-2 space-x-reverse"
              >
                <span className="text-xl">🚪</span>
                <span className="font-medium">התנתקות</span>
              </button>
            </div>
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

      {/* Add Friend Modal */}
      {showAddFriendModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowAddFriendModal(false)}
          />
          <div className="relative w-full max-w-md">
            <div className="bg-white rounded-lg shadow-xl p-6 relative">
              <button
                onClick={() => setShowAddFriendModal(false)}
                className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 
                  w-8 h-8 flex items-center justify-center rounded-full 
                  transition-all duration-300"
              >
                ×
              </button>
              {userId && <AddFriend />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



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
    



export default Home;