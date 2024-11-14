import React, { useEffect, useState } from 'react';
import { ShoppingItem } from '../../modules/ShoppingItem';

interface ShoppingListProps {
    userId: string;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ userId }) => {
    const [items, setItems] = useState<ShoppingItem[]>([]);
    const [newItemName, setNewItemName] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState(1);

    // הפונקציה הזו אחראית לטעון את כל הפריטים ששייכים למשתמש ולחברים שלו
    const fetchShoppingItems = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/shopping?userId=${userId}`);
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error("Failed to fetch items:", error);
        }
    };

    // פונקציה להוספת פריט חדש
    const addItem = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/shopping', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    name: newItemName,
                    quantity: newItemQuantity,
                }),
            });

            if (response.ok) {
                const newItem = await response.json();
                setItems((prevItems) => [...prevItems, newItem]);
                setNewItemName('');
                setNewItemQuantity(1);
            }
        } catch (error) {
            console.error("Failed to add item:", error);
        }
    };

    useEffect(() => {
        fetchShoppingItems();
    }, [userId]);

    return (
        <div>
            <h2>Shopping List</h2>
            <ul>
                {items.map((item) => (
                    <li key={item._id}>
                        {item.name} - Quantity: {item.quantity} - Purchased: {item.isPurchased ? "Yes" : "No"}
                    </li>
                ))}
            </ul>
            <div>
                <input
                    type="text"
                    placeholder="Item name"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(Number(e.target.value))}
                />
                <button onClick={addItem}>Add Item</button>
            </div>
        </div>
    );
};

export default ShoppingList;
