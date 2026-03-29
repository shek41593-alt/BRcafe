import React from 'react';
import Link from 'next/link';
import { PhoneCall, ShoppingBag, Star, MapPin, Clock } from 'lucide-react';
import prisma from '../lib/prisma';
import { getStoreStatus } from '../lib/timing';
import MenuItem from './components/MenuItem';
import FloatingCartButton from './components/FloatingCartButton';

export const dynamic = 'force-dynamic';


async function getStoreData() {
  const store = await prisma.storeLocation.findFirst({
    include: {
      regularHours: true,
      holidayHours: true
    }
  });
  
  const status = getStoreStatus(store);
  return { store, status };
}

export default async function Home() {
  const { store, status } = await getStoreData();
  
  // Fetch popular items from DB
  const featuredItems = await prisma.menuItem.findMany({
    where: { popular: true },
    take: 6
  });

  // Schema.org Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": store?.name || "B.R Bakery, Ice Cream Parlour & Cafe",
    "image": "https://brcafe.example.com/hero-bg.png",
    "@id": "https://brcafe.example.com",
    "url": "https://brcafe.example.com",
    "telephone": "+91 8078071741",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": store?.street || "Kotekar, Beeri",
      "addressLocality": store?.city || "Ullal",
      "postalCode": store?.zipCode || "575022",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": store?.latitude || 12.7966,
      "longitude": store?.longitude || 74.8873
    },
    "openingHoursSpecification": store?.regularHours.map(hr => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][hr.dayOfWeek],
      "opens": hr.openTime,
      "closes": hr.closeTime
    }))
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(rgba(62, 39, 35, 0.7), rgba(62, 39, 35, 0.6)), url(/hero-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        textAlign: 'center',
        padding: 'var(--space-6) var(--space-4)'
      }}>
        <div style={{ maxWidth: '800px', zIndex: 10 }}>
          <h1 style={{ color: 'white', fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: 'var(--space-3)' }}>
            Delicious Food & Ice Cream at Affordable Prices
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.25rem', marginBottom: 'var(--space-6)' }}>
            Freshly prepared every day to bring joy to your taste buds.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-accent" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
              <ShoppingBag size={24} />
              Order Now
            </Link>
            <a href="tel:+918078071741" className="btn" style={{ 
              backgroundColor: 'white', 
              color: 'var(--color-primary)',
              fontSize: '1.125rem', padding: '1rem 2rem' 
            }}>
              <PhoneCall size={24} />
              Call Now
            </a>
          </div>
        </div>
      </section>

      {/* Trust & Availability Section */}
      <section className="section" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ textAlign: 'center', gap: 'var(--space-5)' }}>
            <div style={{ padding: 'var(--space-4)' }}>
              <Star size={40} style={{ color: 'var(--color-secondary-hover)', margin: '0 auto var(--space-3)' }} />
              <h3>4.9/5 Ratings</h3>
              <p>Loved by 1000+ happy local customers.</p>
            </div>
            <div style={{ padding: 'var(--space-4)' }}>
              <MapPin size={40} style={{ color: 'var(--color-secondary-hover)', margin: '0 auto var(--space-3)' }} />
              <h3>Local Favorite</h3>
              <p>{store?.street}, {store?.city}</p>
            </div>
            <div style={{ padding: 'var(--space-4)' }}>
              <Clock size={40} style={{ color: status.isOpen ? 'var(--color-success)' : 'var(--color-error)', margin: '0 auto var(--space-3)' }} />
              <h3 style={{ color: status.isOpen ? 'var(--color-success)' : 'var(--color-error)' }}>
                {status.isOpen ? 'Open Now' : 'Closed Now'}
              </h3>
              <p>{status.message}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="section">
        <div className="container" id="menu-hits">
          <div className="section-title">
            <h2>Our Signature Items</h2>
            <p>The most loved dishes and desserts from our menu.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {featuredItems.map(item => (
              <MenuItem key={item.id} {...item} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
            <Link href="/menu" className="btn btn-primary">
              View Full Menu
            </Link>
          </div>
        </div>
      </section>
      
      <FloatingCartButton />
    </div>
  );
}
