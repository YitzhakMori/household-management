const BASE_URL = 'http://localhost:5001/api/friends';


interface FriendRequestData {
    recipientEmail: string;
}

export const sendFriendRequest = async (data: FriendRequestData) => {
    const response = await fetch(`${BASE_URL}/request`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
};

export const getFriendRequests = async () => {
    const response = await fetch(`${BASE_URL}/requests`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });

    const result = await response.json();
    return result;
};

export const acceptFriendRequest = async (requestId: string) => {
    const response = await fetch(`${BASE_URL}/approve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ requestId }),
    });

    const result = await response.json();
    return result;
};

export const rejectFriendRequest = async (requestId: string) => {
    const response = await fetch(`${BASE_URL}/reject`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ requestId }),
    });

    const result = await response.json();
    return result;
};
