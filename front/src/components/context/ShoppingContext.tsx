import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchShoppingItems } from "../../api/shoppingApi";

interface ShoppingItem {
  _id: string;
  name: string;
  quantity: number;
}

interface ShoppingContextType {
  items: ShoppingItem[];
  itemCount: number;
  reloadItems: () => void;
}

const ShoppingContext = createContext<ShoppingContextType | undefined>(undefined);

export const ShoppingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ShoppingItem[]>([]);

  const reloadItems = async () => {
    try {
      const fetchedItems = await fetchShoppingItems();
      setItems(fetchedItems);
    } catch (error) {
      console.error("Error loading shopping items:", error);
    }
  };

  useEffect(() => {
    reloadItems();
  }, []);

  return (
    <ShoppingContext.Provider value={{ items, itemCount: items.length, reloadItems }}>
      {children}
    </ShoppingContext.Provider>
  );
};

export const useShopping = () => {
  const context = useContext(ShoppingContext);
  if (!context) {
    throw new Error("useShopping must be used within a ShoppingProvider");
  }
  return context;
};
