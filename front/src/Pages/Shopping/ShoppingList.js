import React, { useEffect, useState } from 'react';
import { getShoppingItems } from '../services/shoppingService';

function ShoppingList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchItems() {
      try {
        const data = await getShoppingItems();
        setItems(data);
      } catch (error) {
        console.error('Failed to fetch items:', error);
      }
    }
    fetchItems();
  }, []);

  return (
    <div>
      <h1>רשימת קניות</h1>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            {item.name} - כמות: {item.quantity} - נקנה: {item.purchased ? "כן" : "לא"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShoppingList;
