const BASE_URL = 'http://localhost:5001/api/shopping';
interface ShoppingItem {
  _id: string;
  name: string;
  quantity: number;
  isPurchased: boolean;
  itemGroupId: string | null;
 }

const getToken = () => localStorage.getItem('token');

export const fetchShoppingItems = async (): Promise<ShoppingItem[]> => {
 const token = getToken();
 if (!token) return [];

 try {
   const response = await fetch(BASE_URL, {
     method: 'GET',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}`,
     },
     credentials: 'include',
   });

   if (!response.ok) {
     if (response.status === 401) return [];
     throw new Error('Failed to fetch shopping items');
   }

   return await response.json();
 } catch (error) {
   console.error('Error fetching shopping items:', error);
   return [];
 }
};

export const addShoppingItem = async (
 name: string, 
 quantity: number
): Promise<ShoppingItem | null> => {
 const token = getToken();
 if (!token) return null;

 try {
   const response = await fetch(`${BASE_URL}/addItem`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}`,
     },
     credentials: 'include',
     body: JSON.stringify({ name, quantity }),
   });

   if (!response.ok) {
     if (response.status === 401) return null;
     throw new Error('Failed to add shopping item');
   }

   return await response.json();
 } catch (error) {
   console.error('Error adding shopping item:', error); 
   return null;
 }
};

export const updateShoppingItem = async (
 itemId: string,
 name: string,
 quantity: number
): Promise<ShoppingItem | null> => {
 const token = getToken();
 if (!token) return null;

 try {
   const response = await fetch(`${BASE_URL}/${itemId}`, {
     method: 'PUT',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}`,
     },
     credentials: 'include', 
     body: JSON.stringify({ name, quantity }),
   });

   if (!response.ok) {
     if (response.status === 401) return null;
     throw new Error('Failed to update shopping item');
   }

   return await response.json();
 } catch (error) {
   console.error('Error updating shopping item:', error);
   return null;
 }
};

export const deleteShoppingItem = async (itemId: string): Promise<boolean> => {
 const token = getToken();
 if (!token) return false;

 try {
   const response = await fetch(`${BASE_URL}/${itemId}`, {
     method: 'DELETE',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}`,
     },
     credentials: 'include',
   });

   if (!response.ok) {
     if (response.status === 401) return false;
     throw new Error('Failed to delete shopping item');
   }

   return true;
 } catch (error) {
   console.error('Error deleting shopping item:', error);
   return false;
 }
};