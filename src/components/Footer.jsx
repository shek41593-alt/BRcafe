import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--color-primary)',
      color: 'white',
      padding: 'var(--space-6) 0 var(--space-4) 0',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-5)' }}>
          {/* Brand & Description */}
          <div>
            <h3 style={{ color: 'var(--color-secondary)' }}>B.R Cafe & Ice Cream Parlour</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>
              Delicious Food & Ice Cream at Affordable Prices. Your local spot for hygiene, taste, and a great time.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
              <a href="#" style={{ color: 'white' }}>Insta</a>
              <a href="#" style={{ color: 'white' }}>FB</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'var(--color-secondary)' }}>Quick Links</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <li><Link href="/" style={{ color: 'white' }}>Home</Link></li>
              <li><Link href="/menu" style={{ color: 'white' }}>Our Menu</Link></li>
              <li><Link href="/about" style={{ color: 'white' }}>About Us</Link></li>
              <li><Link href="/contact" style={{ color: 'white' }}>Order & Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ color: 'var(--color-secondary)' }}>Visit Us</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', color: 'rgba(255,255,255,0.9)' }}>
              <li style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
                <MapPin size={20} style={{ flexShrink: 0, marginTop: '4px' }} />
                <span>123 Local Street, College Road Theme Area, City, State 12345</span>
              </li>
              <li style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                <Phone size={20} style={{ flexShrink: 0 }} />
                <a href="tel:+8078071741" style={{ color: 'white' }}>+91 8078071741</a>
              </li>
              <li style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                <Clock size={20} style={{ flexShrink: 0 }} />
                <span>Mon - Sun: 10:00 AM - 11:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: 'var(--space-4)',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.6)',
          fontSize: '0.875rem'
        }}>
          &copy; {new Date().getFullYear()} B.R Cafe & Ice Cream Parlour. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
