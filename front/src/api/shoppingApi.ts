const BASE_URL = 'http://localhost:5001/api/shopping';

// Get all items
export const fetchShoppingItems = async () => {
    const response = await fetch(BASE_URL, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // הוספת הטוקן ישירות
        },
        credentials: 'include', // הכללת cookies
    });

    if (!response.ok) {
        console.error(`Failed to fetch shopping items: ${response.statusText}`);
        throw new Error('Failed to fetch shopping items');
    }

    return await response.json();
};

// Add an item
export const addShoppingItem = async (name: string, quantity: number) => {
    const response = await fetch(`${BASE_URL}/addItem`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // הוספת הטוקן ישירות
        },
        credentials: 'include',
        body: JSON.stringify({ name, quantity }),
    });

    if (!response.ok) {
        console.error(`Failed to add shopping item: ${response.statusText}`);
        throw new Error('Failed to add shopping item');
    }

    return await response.json();
};

// Update an item
export const updateShoppingItem = async (itemId: string, name: string, quantity: number) => {
    const response = await fetch(`${BASE_URL}/${itemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // הוספת הטוקן ישירות
        },
        credentials: 'include',
        body: JSON.stringify({ name, quantity }),
    });

    if (!response.ok) {
        console.error(`Failed to update shopping item: ${response.statusText}`);
        throw new Error('Failed to update shopping item');
    }

    return await response.json();
};

// Delete an item
export const deleteShoppingItem = async (itemId: string) => {
    const response = await fetch(`${BASE_URL}/${itemId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // הוספת הטוקן ישירות
        },
        credentials: 'include',
    });

    if (!response.ok) {
        console.error(`Failed to delete shopping item: ${response.statusText}`);
        throw new Error('Failed to delete shopping item');
    }
};
