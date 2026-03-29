import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Toggle adding/removing an item from the cart
  const toggleItem = (item, quantity) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        // Remove if already exists
        return prev.filter(i => i.id !== item.id);
      } else {
        // Add if not exists
        return [...prev, { ...item, quantity }];
      }
    });
  };

  // Update quantity for a given item ID
  const updateQuantity = (id, newQuantity) => {
    setCartItems(prev => 
      prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
    );
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, toggleItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
