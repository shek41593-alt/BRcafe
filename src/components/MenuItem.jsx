import React, { useState, useEffect } from 'react';
import { ShoppingBag, Minus, Plus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const MenuItem = ({ id, name, price, description, category, imageUrl, popular }) => {
  const { cartItems, toggleItem, updateQuantity } = useCart();
  
  const cartItem = cartItems.find(item => item.id === id);
  const isSelected = !!cartItem;

  const [quantity, setQuantity] = useState(1);

  // Sync local quantity state with cart if the item is already selected
  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItem]);

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      if (isSelected) updateQuantity(id, newQty);
    }
  };

  const handleIncrease = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    if (isSelected) updateQuantity(id, newQty);
  };

  const handleToggle = () => {
    toggleItem({ id, name, price, description, category, imageUrl, popular }, quantity);
  };

  return (
    <div className="card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      padding: 0,
      border: isSelected ? '2px solid var(--color-success)' : '1px solid var(--color-border)',
      backgroundColor: isSelected ? 'var(--color-success-bg)' : 'var(--color-surface)',
      boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      transition: 'all var(--transition-normal)'
    }}>
      {popular && (
        <span style={{
          position: 'absolute',
          top: 'var(--space-3)',
          right: 'var(--space-3)',
          backgroundColor: 'var(--color-accent)',
          color: 'white',
          padding: '0.25rem 0.75rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          zIndex: 10,
          boxShadow: 'var(--shadow-sm)'
        }}>
          Popular
        </span>
      )}

      {/* Image Container */}
      <div style={{
        width: '100%',
        height: '200px',
        backgroundColor: 'var(--color-border)',
        overflow: 'hidden'
      }}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: 'var(--color-text-muted)' }}>
            No Image
          </div>
        )}
      </div>

      {/* Content Container */}
      <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{name}</h3>
          <span style={{ 
            fontWeight: '700', 
            color: 'var(--color-primary)', 
            fontSize: '1.125rem' 
          }}>
            ₹{price}
          </span>
        </div>
        
        <p style={{ fontSize: '0.875rem', flexGrow: 1, marginBottom: 'var(--space-4)' }}>
          {description}
        </p>

        <div className="menu-item-actions" style={{ 
          display: 'flex', 
          gap: 'var(--space-2)', 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            border: isSelected ? '1px solid var(--color-success)' : '1px solid var(--color-border)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            flexShrink: 0,
            backgroundColor: isSelected ? '#ffffff' : 'var(--color-bg-light)'
          }}>
            <button onClick={handleDecrease} style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Decrease quantity">
              <Minus size={16} />
            </button>
            <span style={{ width: '24px', textAlign: 'center', fontWeight: '600', fontSize: '0.9rem' }}>{quantity}</span>
            <button onClick={handleIncrease} style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Increase quantity">
              <Plus size={16} />
            </button>
          </div>
          
          <button 
            onClick={handleToggle} 
            className={`btn ${isSelected ? "btn-outline" : "btn-primary"}`} 
            style={{ 
              flexGrow: 1, 
              padding: '8px 12px',
              fontSize: '0.9rem',
              height: '40px',
              minWidth: '100px',
              borderColor: isSelected ? 'var(--color-success)' : '',
              color: isSelected ? 'var(--color-success)' : '',
              backgroundColor: isSelected ? 'transparent' : ''
            }}
          >
            {isSelected ? (
              <>
                <Check size={16} />
                <span style={{ whiteSpace: 'nowrap' }}>Selected</span>
              </>
            ) : (
              <>
                <ShoppingBag size={16} />
                <span style={{ whiteSpace: 'nowrap' }}>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
