"use client";
import React, { useState, useEffect } from 'react';
import MenuItem from '../components/MenuItem';

const MenuClient = ({ categories, initialItems }) => {
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    // Tracking page hit
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'page_hit', page: '/menu' })
    }).catch(err => console.error('Tracking hit error:', err));
  }, []);

  const filteredItems = activeCategory === "All" 
    ? initialItems 
    : initialItems.filter(item => item.category === activeCategory);

  return (
    <>
      {/* Category Filters */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 'var(--space-2)',
        marginTop: 'var(--space-4)',
        marginBottom: 'var(--space-8)'
      }}>
        <button 
          className={`btn ${activeCategory === "All" ? "btn-primary" : "btn-outline"}`}
          style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1rem' }}
          onClick={() => setActiveCategory("All")}
        >
          All Items
        </button>
        {categories.map(cat => (
          <button 
            key={cat}
            className={`btn ${activeCategory === cat ? "btn-primary" : "btn-outline"}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1rem' }}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="container" style={{ marginBottom: 'var(--space-10)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 'var(--space-6)' }}>
          {filteredItems.map(item => (
            <MenuItem key={item.id} {...item} />
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--space-8) 0', color: 'var(--color-text-muted)' }}>
            <h3>No items available in this category yet.</h3>
          </div>
        )}
      </div>
    </>
  );
};

export default MenuClient;
