import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiCheckCircle, FiShield, FiHeart, FiMapPin, FiArrowRight, FiUsers, FiCamera, FiSun, FiBriefcase } from 'react-icons/fi';
import { useScrollReveal } from '../AnimationUtils';

const ABOUT_CARDS = [
  { icon: <FiHeart size={32} />, label: 'Weddings' },
  { icon: <FiUsers size={32} />, label: 'Family Functions' },
  { icon: <FiCamera size={32} />, label: 'Temple Visits' },
  { icon: <FiSun size={32} />, label: 'Picnics' },
  { icon: <FiUsers size={32} />, label: 'Group Outings' },
  { icon: <FiBriefcase size={32} />, label: 'Corporate Events' },
];

export default function AboutPage() {
  useScrollReveal();
  const navigate = useNavigate();

  return (
    <main className="page-wrapper">
      <Helmet>
        <title>About Us | Leema Raj Cottage Stay</title>
        <meta name="description" content="Learn more about Leema Raj Cottage Stay. The perfect retreat for weddings, family functions, and group outings." />
      </Helmet>
      <div className="compact-page-header">
        <div className="container">
          <h1>About Us</h1>
          <p>Discover Leema Raj Cottage Stay</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: 'var(--space-16)' }}>
            <div className="reveal-left">
              <span className="section-eyebrow">Our Story</span>
              <h2 style={{ margin: 'var(--space-3) 0 var(--space-5)' }}>
                A Perfect Retreat for Every Occasion
              </h2>
              <p style={{ color: 'var(--color-muted)', marginBottom: 'var(--space-4)', lineHeight: 1.8 }}>
                Leema Raj Cottage Stay is designed to offer a comfortable,
                spacious, and peaceful environment for families and groups. Whether you are
                planning a grand wedding, a close-knit family function, or a relaxing group
                outing, our property provides the ideal setting.
              </p>
              <p style={{ color: 'var(--color-muted)', lineHeight: 1.8 }}>
                Located conveniently for temple visits and weekend picnics, our fully
                air-conditioned rooms with premium teakwood beds ensure a restful stay.
                We pride ourselves on maintaining a clean, secure, and welcoming atmosphere
                with 24/7 support.
              </p>
            </div>
            <div className="img-zoom-wrapper reveal-right" style={{ aspectRatio: '4/3', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
              <img src="https://res.cloudinary.com/dvlr6tukk/image/upload/v1780819958/House_oto8a3.webp" alt="Leema Raj Cottage Stay" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-alt">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-eyebrow">Perfect For</span>
            <div className="section-divider"><span style={{ color: 'var(--color-accent)' }}>✦</span></div>
            <h2>Best Suited For</h2>
            <p>Our property is tailored to host a variety of events and gatherings</p>
          </div>
          <div className="grid-3">
            {ABOUT_CARDS.map((card, i) => (
              <div key={card.label} className={`card card-body text-center reveal reveal-delay-${(i % 3) + 1}`}>
                <div style={{
                  fontSize: '3rem',
                  lineHeight: 1,
                  margin: '0 auto var(--space-4)',
                  width: 80, height: 80,
                  borderRadius: '50%',
                  background: 'var(--color-soft)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {card.icon}
                </div>
                <h4 style={{ color: 'var(--color-secondary)' }}>{card.label}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property Highlights Section */}
      <section className="section" style={{ background: '#FFFFFF' }}>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-eyebrow">The Details</span>
            <div className="section-divider"><span style={{ color: 'var(--color-accent)' }}>✦</span></div>
            <h2>Property Highlights</h2>
            <p>Everything you need for a comfortable stay</p>
          </div>
          <div className="grid-3">
            {[
              '5 Queen Size Teakwood Beds',
              'Fully Air-Conditioned Rooms',
              '65-Inch Smart TV with OTT Access',
              'Free High-Speed Wi-Fi',
              'Extra Beds Available on Request',
              '24 Hours Hot & Normal Water Facility',
              '24 Hours RO Drinking Water Facility',
              'Spacious, Clean and Peaceful Environment',
              'Ideal for Group Gatherings & Temple Visits'
            ].map((highlight, i) => (
              <div key={i} className={`reveal reveal-delay-${(i % 5) + 1}`} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                <FiCheckCircle size={20} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: 2 }} />
                <span style={{ color: 'var(--color-secondary)', fontWeight: 500, lineHeight: 1.5 }}>{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-alt">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-eyebrow">Our Values</span>
            <div className="section-divider"><span style={{ color: 'var(--color-accent)' }}>✦</span></div>
            <h2>Why Choose Us</h2>
            <p>We go above and beyond to make your stay special</p>
          </div>
          <div className="grid-3">
            <div className="card card-body reveal-left">
              <div style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}><FiHeart size={32} /></div>
              <h4 style={{ marginBottom: 'var(--space-2)' }}>Comfort First</h4>
              <p className="text-muted">Premium teakwood beds, fresh linens, and fully AC rooms guarantee a perfect night's sleep.</p>
            </div>
            <div className="card card-body reveal-scale">
              <div style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}><FiShield size={32} /></div>
              <h4 style={{ marginBottom: 'var(--space-2)' }}>Safe & Secure</h4>
              <p className="text-muted">A private, peaceful property strictly enforcing no alcohol/smoking policies for a family-friendly environment.</p>
            </div>
            <div className="card card-body reveal-right">
              <div style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}><FiMapPin size={32} /></div>
              <h4 style={{ marginBottom: 'var(--space-2)' }}>Prime Location</h4>
              <p className="text-muted">Conveniently located for major temple visits and quick weekend getaways with easy road access.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: `linear-gradient(135deg, var(--color-secondary) 0%, #1a2638 100%)`,
        padding: 'var(--space-20) var(--space-6)',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{ color: '#FFFFFF', fontSize: 'clamp(2rem, 4vw, 2.5rem)', marginBottom: 'var(--space-4)' }}>
            Plan Your Stay With Us
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 600, margin: '0 auto var(--space-8)', fontSize: 'var(--text-lg)' }}>
            Experience the finest comfort for your family and friends. Check our availability and book today.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <button className="btn btn-accent btn-lg" onClick={() => navigate('/rooms')}>
              Book Now <FiArrowRight style={{ marginLeft: 6 }} />
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => navigate('/contact')}>
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
