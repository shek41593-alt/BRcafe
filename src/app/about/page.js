import React from 'react';
import { Heart, Sparkles, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function About() {
  return (
    <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ alignItems: 'center', gap: 'var(--space-8)' }}>
          {/* Image Side */}
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
            aspectRatio: '1'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop" 
              alt="B.R Cafe Interior" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          
          {/* Text Side */}
          <div>
            <h1 style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>Our Story</h1>
            
            <p style={{ fontSize: '1.125rem', marginBottom: 'var(--space-4)', lineHeight: '1.8' }}>
              Welcome to <strong>B.R Cafe & Ice Cream Parlour</strong>! Since we opened our doors, our goal has been simple: to provide a friendly, vibrant space where students, families, and locals can enjoy delicious food at affordable prices.
            </p>

            <p style={{ fontSize: '1.125rem', marginBottom: 'var(--space-5)', lineHeight: '1.8' }}>
              From our famous crispy dosas to our thick, creamy milkshakes, everything is prepared fresh daily with the highest safety and hygiene standards. We believe in building trust through taste and quality.
            </p>

            <div className="grid grid-cols-1" style={{ gap: 'var(--space-4)' }}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <Heart size={32} style={{ color: 'var(--color-accent)' }} />
                <div>
                  <h3 style={{ margin: 0 }}>Made with Love</h3>
                  <p style={{ margin: 0, fontSize: '0.875rem' }}>Authentic recipes bringing comfort and joy.</p>
                </div>
              </div>

              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <Sparkles size={32} style={{ color: 'var(--color-accent)' }} />
                <div>
                  <h3 style={{ margin: 0 }}>Top Hygiene</h3>
                  <p style={{ margin: 0, fontSize: '0.875rem' }}>Clean kitchens, fresh ingredients.</p>
                </div>
              </div>

              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <MapPin size={32} style={{ color: 'var(--color-accent)' }} />
                <div>
                  <h3 style={{ margin: 0 }}>Local Roots</h3>
                  <p style={{ margin: 0, fontSize: '0.875rem' }}>Proudly serving our neighborhood.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
