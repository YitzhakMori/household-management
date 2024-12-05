import React, { useEffect, useState } from "react";
import {
  fetchShoppingItems,
  addShoppingItem,
  updateShoppingItem,
  deleteShoppingItem,
} from "../api/shoppingApi";

interface ShoppingItem {
  _id: string;
  name: string;
  quantity: number;
}

const ShoppingList: React.FC = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    if (!name.trim() || quantity < 1) {
      alert("אנא הכנס שם וכמות חוקית.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const newItem: ShoppingItem = await addShoppingItem(
        name.trim(),
        quantity
      );
      setItems([...items, newItem]);
      setName("");
      setQuantity(1);
    } catch (error) {
      setError("שגיאה בהוספת מוצר.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItemId || !name.trim() || quantity < 1) {
      alert("אנא מלא את כל השדות.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const updatedItem: ShoppingItem = await updateShoppingItem(
        editingItemId,
        name.trim(),
        quantity
      );
      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === editingItemId ? { ...item, ...updatedItem } : item
        )
      );
      setEditingItemId(null);
      setName("");
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
    <div dir="rtl" className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => (window.location.href = "/home")}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
          >
            חזרה לדף הבית
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">רשימת קניות</h1>
            <p className="text-blue-100">נהל את רשימת הקניות שלך בקלות</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Add/Edit Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="שם מוצר"
              className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold transition-colors"
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                placeholder="כמות"
                min={1}
                className="w-20 p-3 border rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold transition-colors"
              >
                +
              </button>
            </div>
            <button
              onClick={editingItemId ? handleUpdateItem : handleAddItem}
              className={`px-8 py-3 rounded-lg text-white font-medium transition-all
                                ${
                                  editingItemId
                                    ? "bg-gradient-to-r from-green-500 to-green-600"
                                    : "bg-gradient-to-r from-blue-500 to-purple-600"
                                } 
                                hover:shadow-lg hover:scale-105`}
            >
              {editingItemId ? "✏️ עדכן" : "➕ הוסף מוצר"}
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {loading && (
          <div className="text-center bg-white rounded-lg shadow p-4 mb-6">
            <div className="animate-spin inline-block w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <span className="mr-2">טוען...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">❌</div>
              <div className="mr-3">{error}</div>
            </div>
          </div>
        )}

        {/* Shopping List */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">🛒</span>
                  <span className="text-lg font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                    {item.quantity} יח׳
                  </span>
                  <button
                    onClick={() => {
                      setName(item.name);
                      setQuantity(item.quantity);
                      setEditingItemId(item._id);
                    }}
                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"
                  >
                    <span className="text-xl">✏️</span>
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="flex items-center justify-center w-8 h-8 bg-green-100 hover:bg-green-200 text-green-600 rounded-full transition-colors"
                  >
                    <span className="text-xl">✓</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;
