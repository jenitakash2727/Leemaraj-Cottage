import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiUsers, FiClock, FiCheckCircle, FiArrowRight, FiInfo, FiHome, FiWifi, FiShield, FiHeart, FiMapPin, FiCamera, FiLayers } from 'react-icons/fi';
import { InlineError } from '../components/Common/LoadingSpinner';
import { SkeletonHero } from '../components/Common/SkeletonLoaders';
import { getPackages } from '../services/api';
import { formatCurrency } from '../utils/helpers';
import { useScrollReveal } from '../AnimationUtils';
import { FALLBACK_PACKAGES } from '../utils/fallbackData';

export default function GroupBookingPage() {
  useScrollReveal();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    getPackages()
      .then(res => {
        setPackages(res.data?.length ? res.data : FALLBACK_PACKAGES);
      })
      .catch(err => {
        console.error('Failed to load packages, using fallback.', err);
        setPackages(FALLBACK_PACKAGES);
      })
      .finally(() => setLoading(false));
  }, []);

  const wholeCottagePackage = packages.find(p => p.title === 'Whole Cottage Group Booking') || packages[0];

  return (
    <main className="page-wrapper">
      <Helmet>
        <title>Entire Cottage Booking | Leema Raj Cottage Stay</title>
        <meta name="description" content="Whole cottage group booking. Affordable group packages. Perfect for weddings, picnics, and family gatherings." />
      </Helmet>

      <div className="compact-page-header">
        <div className="container">
          <h1>Entire Cottage Booking</h1>
          <p>Exclusive access to the full property for large groups and events</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {loading && <SkeletonHero />}
          {error   && <InlineError message={error} />}

          {!loading && !error && wholeCottagePackage && (
            <div className="grid-2 reveal-scale">
              {/* Left Column - Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                <div>
                  <h2 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-4)', color: 'var(--color-secondary)' }}>Experience Complete Privacy</h2>
                  <p style={{ fontSize: 'var(--text-lg)', lineHeight: 1.6, color: 'var(--color-muted)' }}>
                    Group booking is available for groups <strong>greater than 35 members</strong>. Enjoy the privacy and space of our entire cottage for your group, ensuring an unforgettable and exclusive stay.
                  </p>
                </div>

                <div>
                  <h3 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-4)', color: 'var(--color-secondary)' }}>What's Included</h3>
                  <div className="grid-2" style={{ gap: 'var(--space-4)' }}>
                    {[
                      { icon: <FiHome />, title: '5 Rooms', desc: 'Fully furnished, AC rooms' },
                      { icon: <FiUsers />, title: '2 Common Areas', desc: 'Spacious areas for gathering' },
                      { icon: <FiLayers />, title: 'Ground Floor', desc: '850 sq ft living space' },
                      { icon: <FiLayers />, title: 'First Floor', desc: '1100 sq ft living space' },
                      { icon: <FiShield />, title: 'Secure Parking', desc: 'Ample parking space' },
                      { icon: <FiWifi />, title: 'Free Wi-Fi', desc: 'High-speed internet access' }
                    ].map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'var(--color-soft)', padding: '16px', borderRadius: '12px' }}>
                        <div style={{ color: 'var(--color-primary)', marginTop: 2 }}>{item.icon}</div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--color-secondary)', fontSize: '0.95rem' }}>{item.title}</div>
                          <div style={{ color: 'var(--color-muted)', fontSize: '0.85rem', marginTop: 2 }}>{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ padding: 'var(--space-4)', borderLeft: '4px solid var(--color-accent)', background: 'rgba(217, 119, 6, 0.05)', color: 'var(--color-secondary)', borderRadius: '0 8px 8px 0' }}>
                  <p style={{ margin: 0, display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                    <FiInfo style={{ marginTop: 4, flexShrink: 0, color: 'var(--color-accent)' }} />
                    <span>For any queries regarding accommodation, stay arrangements, group bookings, room details, or the number of guests, please <a href="/contact" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>contact us</a>.</span>
                  </p>
                </div>
              </div>

              {/* Right Column - Pricing Card */}
              <div>
                <div className="card card-body text-center" style={{ border: '2px solid var(--color-primary)', position: 'sticky', top: '100px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'var(--color-soft)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto var(--space-5)',
                    color: 'var(--color-primary)',
                  }}>
                    <FiUsers size={32} />
                  </div>
                  
                  <h3 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>Whole Cottage</h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--color-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
                    <FiClock size={14} /> 24 Hours Stay
                  </div>
                  
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                    color: 'var(--color-primary)',
                    fontWeight: 700,
                    lineHeight: 1,
                    marginBottom: 'var(--space-2)',
                  }}>
                    {formatCurrency(23000)}
                  </div>
                  <p style={{ color: 'var(--color-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
                    per day (minimum 35 guests)
                  </p>

                  <div style={{ background: 'var(--color-soft)', borderRadius: '8px', padding: '12px', marginBottom: '24px', fontSize: '0.9rem', color: 'var(--color-secondary)', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <FiCheckCircle color="#10B981" /> No Hidden Charges
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <button
                      className="btn btn-outline w-full"
                      onClick={() => navigate('/group-booking/details')}
                    >
                      View Details
                    </button>
                    <button
                      className="btn btn-primary btn-lg w-full"
                      onClick={() => navigate('/group-booking/details')}
                    >
                      Book Now <FiArrowRight style={{ marginLeft: 8 }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Use Case Section */}
          {!loading && !error && (
            <div style={{ marginTop: 'var(--space-24)' }}>
              <div className="section-header reveal">
                <span className="section-eyebrow">Perfect For</span>
                <h2>Events &amp; Gatherings</h2>
                <p>Booking the entire property gives you exclusive privacy for your group</p>
              </div>
              
              <div className="grid-3" style={{ gap: 'var(--space-6)' }}>
                {[
                  { name: 'Weddings', icon: <FiHeart size={24} /> },
                  { name: 'Family Functions', icon: <FiHome size={24} /> },
                  { name: 'Team Outings', icon: <FiUsers size={24} /> },
                  { name: 'Temple Visits', icon: <FiMapPin size={24} /> },
                  { name: 'Reunions', icon: <FiCamera size={24} /> }
                ].map((item, idx) => (
                  <div key={idx} className={`card card-body reveal-scale text-center`} style={{ padding: 'var(--space-8)', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', transition: 'transform 0.3s ease', cursor: 'default' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div style={{ color: 'var(--color-primary)' }}>{item.icon}</div>
                    <h4 style={{ margin: 0, color: 'var(--color-secondary)' }}>{item.name}</h4>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Callout */}
          {!loading && (
            <div style={{ marginTop: 'var(--space-16)', background: 'var(--color-secondary)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-10)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-8)', flexWrap: 'wrap' }}>
              <div>
                <h3 style={{ color: '#FFFFFF', marginBottom: 'var(--space-2)' }}>Have questions about your group stay?</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-sm)' }}>
                  Call us at +91 78456 71542 to discuss your group booking requirements.
                </p>
              </div>
              <button className="btn btn-accent btn-lg" onClick={() => navigate('/contact')}>
                Contact Us
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
