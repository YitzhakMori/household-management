
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
  
  const menuItems = [/* ... קוד קיים ... */];
  const quickStats = [/* ... קוד קיים ... */];

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

      {/* Rest of the existing content */}
      {/* ... Quick Stats ... */}
      {/* ... Main Content ... */}
      {/* ... Footer ... */}

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

export default Home;
