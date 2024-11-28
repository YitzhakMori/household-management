import React, { useEffect, useState } from 'react';
import {fetchShoppingItems,addShoppingItem,updateShoppingItem,deleteShoppingItem} from '../../api/shoppingApi';
import styles from './ShoppingList.module.css';
import NavBar from '../../nav/Navbar';
// הגדרת הטייפ למוצר
interface ShoppingItem {
    _id: string;
    name: string;
    quantity: number;
}

const ShoppingList: React.FC = () => {
    const [items, setItems] = useState<ShoppingItem[]>([]);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState<number | ''>(1);
    const [loading, setLoading] = useState(false);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const buttons = [
        { path: '/Home', label: 'עמוד הבית' },
        { path: '/events', label: 'אירועים' }
      ];
    const loadItems = async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedItems: ShoppingItem[] = await fetchShoppingItems();
            setItems(fetchedItems);
        } catch (error) {
            setError("שגיאה בטעינת רשימת הקניות.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    const handleAddItem = async () => {
        if (!name.trim() || quantity === '' || quantity <= 0) {
            alert('אנא הכנס שם וכמות חוקית.');
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const newItem: ShoppingItem = await addShoppingItem(name.trim(), quantity);
            setItems([...items, newItem]);
            setName('');
            setQuantity(1);
        } catch (error) {
            setError("שגיאה בהוספת מוצר.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateItem = async () => {
        if (!editingItemId || !name.trim() || typeof quantity !== 'number' || quantity <= 0) {
            alert('אנא מלא את כל השדות.');
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const updatedItem: ShoppingItem = await updateShoppingItem(editingItemId, name.trim(), quantity);

            setItems((prevItems) =>
                prevItems.map((item) =>
                    item._id === editingItemId ? { ...item, ...updatedItem } : item
                )
            );
            setEditingItemId(null);
            setName('');
            setQuantity(1);
        } catch (error) {
            setError("שגיאה בעדכון מוצר.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        try {
            setLoading(true);
            setError(null);
            await deleteShoppingItem(itemId);
            setItems(items.filter((item) => item._id !== itemId));
        } catch (error) {
            setError("שגיאה במחיקת מוצר.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <NavBar buttons={buttons} />
            <h1 className={styles.title}>רשימת קניות</h1>
            {loading && <p className={styles.loading}>טוען...</p>}
            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.inputGroup}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="שם מוצר"
                    className={styles.input}
                />
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    placeholder="כמות"
                    className={`${styles.input} ${styles.quantityInput}`}
                    min={1}
                />
                {editingItemId ? (
                    <button
                        onClick={handleUpdateItem}
                        className={`${styles.button} ${styles.updateButton}`}
                    >
                        עדכן מוצר
                    </button>
                ) : (
                    <button
                        onClick={handleAddItem}
                        className={`${styles.button} ${styles.addButton}`}
                    >
                        הוסף מוצר
                    </button>
                )}
            </div>

            <ul className={styles.list}>
                {items.map((item) => (
                    <li key={item._id} className={styles.listItem}>
                        <span className={styles.itemText}>
                            {item.name} - {item.quantity}
                        </span>
                        <button
                            onClick={() => {
                                setName(item.name);
                                setQuantity(item.quantity);
                                setEditingItemId(item._id);
                            }}
                            className={`${styles.button} ${styles.editButton}`}
                        >
                            ערוך
                        </button>
                        <button
                            onClick={() => handleDeleteItem(item._id)}
                            className={`${styles.button} ${styles.deleteButton}`}
                        >
                            מחק
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ShoppingList;
