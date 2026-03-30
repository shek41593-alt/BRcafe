"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu as MenuIcon, X, PhoneCall } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'About', path: '/about' },
    { name: 'Order & Contact', path: '/contact' },
  ];

  return (
    <header className="navbar-header" style={{
      backgroundColor: 'var(--color-surface)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-sm)',
      padding: 'var(--space-3) 0'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <Link href="/" className="logo" onClick={closeMenu} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          maxWidth: '65%',
          overflow: 'hidden'
        }}>
          <span className="logo-text" style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'var(--color-primary)',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden'
          }}>
            B.R Cafe
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav" style={{ display: 'none' }}>
          <ul style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.path}
                  style={{
                    color: pathname === link.path ? 'var(--color-primary)' : 'var(--color-text-main)',
                    fontWeight: pathname === link.path ? '600' : '500',
                  }}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              <a href="tel:+8078071741" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                <PhoneCall size={18} />
                Call Now
              </a>
            </li>
          </ul>
        </nav>

        {/* Mobile Toggle & Call Icon */}
        <div className="mobile-actions" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--space-4)',
          flexShrink: 0
        }}>
          <a href="tel:+8078071741" style={{ color: 'var(--color-primary)', display: 'flex' }} className="mobile-call">
            <PhoneCall size={24} />
          </a>
          <button onClick={toggleMenu} style={{ 
            color: 'var(--color-text-main)',
            display: 'flex',
            padding: '4px'
          }}>
            {isOpen ? <X size={28} /> : <MenuIcon size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'var(--color-surface)',
          padding: 'var(--space-4)',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)'
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={closeMenu}
              style={{
                fontSize: '1.125rem',
                padding: 'var(--space-2) 0',
                borderBottom: '1px solid var(--color-border)',
                color: pathname === link.path ? 'var(--color-primary)' : 'var(--color-text-main)',
                fontWeight: pathname === link.path ? '600' : '400',
              }}
            >
              {link.name}
            </Link>
          ))}
          <a href="tel:+8078071741" className="btn btn-primary" style={{ marginTop: 'var(--space-3)' }}>
            <PhoneCall size={20} />
            Call Us Now
          </a>
        </div>
      )}
      
      {/* Basic inline media queries for layout */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: block !important; }
          .mobile-actions { display: none !important; }
          .mobile-menu { display: none !important; }
        }
        @media (max-width: 480px) {
          .logo-text { font-size: 1.25rem !important; }
          .mobile-actions { gap: var(--space-3) !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
