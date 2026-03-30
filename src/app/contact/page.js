"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PhoneCall, MapPin, Mail, Send, Menu as MenuIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import FloatingCartButton from '../components/FloatingCartButton';

const ContactContent = () => {
  const { cartItems, clearCart } = useCart();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
    orderType: 'PICKUP', // 'PICKUP' or 'DELIVERY'
    deliveryAddress: ''
  });
  
  const [isLocating, setIsLocating] = useState(false);
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storeInfo, setStoreInfo] = useState(null);

  useEffect(() => {
    // 1. Fetch store info
    fetch('/api/store-info')
      .then(res => res.json())
      .then(data => {
        // If it's an array, take the first store for now
        const store = Array.isArray(data) ? data[0] : (data || {});
        setStoreInfo(store);
      })
      .catch(err => console.error('Failed to fetch store info:', err));

    // 2. Initial tracking
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'page_hit', page: '/contact' })
    }).catch(err => console.error('Tracking hit error:', err));

    // 3. Pre-fill message
    if (cartItems && cartItems.length > 0) {
      const orderLines = cartItems.map(item => `- ${item.quantity}x ${item.name} (₹${item.price * item.quantity})`).join('\n');
      const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const messageText = `I would like to order:\n${orderLines}\n\nTotal: ₹${total}`;
      
      setFormData(prev => ({ ...prev, message: messageText }));
    } else {
      const orderItem = searchParams.get('order');
      const orderQty = searchParams.get('qty');
      if (orderItem) {
        const quantityText = orderQty ? ` (Quantity: ${orderQty})` : '';
        setFormData(prev => ({ ...prev, message: `I would like to order: ${orderItem}${quantityText}` }));
      }
    }
  }, [cartItems, searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Calculate total amount from cart if available
      const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      
      // 1. Submit to our new API (Prisma + Twilio)
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          totalAmount: total > 0 ? total.toFixed(2) : "0.00",
          items: cartItems
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.details || result.error || 'Failed to submit order');
      }

      // 2. Clear cart and set success
      setIsSubmitted(true);
      setFormData({ name: '', phone: '', message: '' });
      clearCart();

      // 3. Client-side WhatsApp Redirect (Direct customer to owner's WhatsApp)
      const orderIcon = formData.orderType === 'DELIVERY' ? '🚚' : '🥡';
      const deliveryText = formData.orderType === 'DELIVERY' ? `\n*Delivery Address*: ${formData.deliveryAddress}` : '\n*Type*: Store Pick up';
      
      const encodedMsg = encodeURIComponent(`*New Order from B.R Cafe!* ${orderIcon}\n\n*Name*: ${formData.name}\n*Phone*: ${formData.phone}${deliveryText}\n\n*Details*:\n${formData.message}\n\n*Total*: ₹${total > 0 ? total.toFixed(2) : "0.00"}`);
      const whatsappUrl = `https://wa.me/918078071741?text=${encodedMsg}`;
      
      // We'll give the user a second to see the success message then redirect
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1500);
      
      // 4. Track order submission analytics
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'order_submission', 
          page: '/contact', 
          metadata: { 
            itemCount: cartItems.length,
            orderId: result.order?.id,
            whatsappSent: result.whatsappSent
          } 
        })
      });

      setTimeout(() => {
        setIsSubmitted(false);
      }, 8000);

    } catch (err) {
      console.error("Order submission failed:", err);
      alert(`Something went wrong: ${err.message}. Please try calling us directly.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const trackGetDirections = () => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'get_directions', page: '/contact' })
    }).catch(err => console.error('Tracking direction error:', err));
    
    // Redirect to Google Maps
    const address = `${storeInfo?.street}, ${storeInfo?.city}, ${storeInfo?.state}`;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`, '_blank');
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocoding using Nominatim (free)
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
          const data = await response.json();
          
          if (data && data.display_name) {
            setFormData(prev => ({ 
              ...prev, 
              deliveryAddress: `${data.display_name} (GPS: ${latitude}, ${longitude})` 
            }));
          } else {
            setFormData(prev => ({ 
              ...prev, 
              deliveryAddress: `Lat: ${latitude}, Long: ${longitude}` 
            }));
          }
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          setFormData(prev => ({ 
            ...prev, 
            deliveryAddress: `Lat: ${latitude}, Long: ${longitude}` 
          }));
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLocating(false);
        alert("Failed to get your location. Please type your address manually.");
      }
    );
  };

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="section-title">
          <h1 style={{ color: 'var(--color-primary)' }}>Order & Contact</h1>
          <p>We'd love to hear from you. Place an order or choose delivery!</p>
        </div>

        <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          {isSubmitted && (
            <div style={{
              backgroundColor: '#d4edda',
              color: '#155724',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--space-4)',
              textAlign: 'center',
              fontWeight: '500'
            }}>
              Thank you! Your order/inquiry has been received and we will get back to you shortly.
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-control"
                placeholder="+91 8078071741"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Order Type</label>
              <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <button
                  type="button"
                  className={`btn ${formData.orderType === 'PICKUP' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1 }}
                  onClick={() => setFormData(prev => ({ ...prev, orderType: 'PICKUP' }))}
                >
                  🥡 Store Pick up
                </button>
                <button
                  type="button"
                  className={`btn ${formData.orderType === 'DELIVERY' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1 }}
                  onClick={() => setFormData(prev => ({ ...prev, orderType: 'DELIVERY' }))}
                >
                  🚚 Home Delivery
                </button>
              </div>
            </div>

            {formData.orderType === 'DELIVERY' && (
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                  <label className="form-label" htmlFor="deliveryAddress" style={{ margin: 0 }}>Delivery Address</label>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isLocating}
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: 'var(--color-accent)',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <MapPin size={16} />
                    {isLocating ? 'Locating...' : 'Use My Location'}
                  </button>
                </div>
                <textarea
                  id="deliveryAddress"
                  name="deliveryAddress"
                  className="form-control"
                  rows="3"
                  placeholder="Street, Landmark, City..."
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  required={formData.orderType === 'DELIVERY'}
                />
              </div>
            )}

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                <label className="form-label" htmlFor="message" style={{ margin: 0 }}>Order Details / Message</label>
                <Link href="/menu" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-primary)' }}>
                  <MenuIcon size={16} />
                  Browse Menu
                </Link>
              </div>
              <textarea
                id="message"
                name="message"
                className="form-control"
                rows="7"
                placeholder="Write your order details or questions here..."
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', fontSize: '1.125rem' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>Processing...</>
              ) : (
                <>
                  <Send size={20} />
                  Submit Details & Notify via WhatsApp
                </>
              )}
            </button>
          </form>
        </div>

        {/* Contact info below form */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'var(--space-4)' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <PhoneCall size={32} style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }} />
            <h3>Call Us Direct</h3>
            <p>Prefer to speak to us? Call us right away for fast ordering.</p>
            <a href="tel:+918078071741" className="btn btn-primary" style={{ marginTop: 'auto' }}>
              +91 8078071741
            </a>
          </div>
          
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <MapPin size={32} style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }} />
            <h3>Visit The Cafe</h3>
            <p>
              {storeInfo ? (
                <>
                  {storeInfo.street} <br/>
                  {storeInfo.city}, {storeInfo.state} {storeInfo.zipCode}
                </>
              ) : (
                <>Loading address...</>
              )}
            </p>
            <button onClick={trackGetDirections} className="btn btn-outline" style={{ marginTop: 'auto' }}>
              Get Directions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ContactPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactContent />
      <FloatingCartButton />
    </Suspense>
  );
}
