"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FloatingCartButton = () => {
  const { cartItems } = useCart();
  const pathname = usePathname();

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const showFloatingButton = cartItems.length > 0 && pathname !== '/contact';

  if (!showFloatingButton) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      zIndex: 50
    }}>
      <Link href="/contact" className="btn btn-primary" style={{
        padding: '1rem 2rem',
        borderRadius: 'var(--radius-full)',
        boxShadow: 'var(--shadow-lg)',
        fontSize: '1.125rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        animation: 'pulse 2s infinite'
      }}>
        <ShoppingBag size={24} />
        Confirm Order ({totalItems})
      </Link>
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default FloatingCartButton;
