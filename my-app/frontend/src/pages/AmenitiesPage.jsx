import React, { useEffect, useState } from 'react';
import { LoadingSpinner, InlineError } from '../components/Common/LoadingSpinner';
import { SkeletonGrid } from '../components/Common/SkeletonLoaders';
import { getAmenities } from '../services/api';
import { getIcon } from '../utils/iconMapper';
import { useScrollReveal } from '../AnimationUtils';
import { FALLBACK_AMENITIES } from '../utils/fallbackData';

export default function AmenitiesPage() {
  useScrollReveal();
  const [amenities, setAmenities] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');

  useEffect(() => {
    getAmenities()
      .then(res => {
        setAmenities(res.data?.length ? res.data : FALLBACK_AMENITIES);
      })
      .catch(err => {
        console.error('Failed to load amenities, using fallback.', err);
        setAmenities(FALLBACK_AMENITIES);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page-wrapper">
      <div className="compact-page-header">
        <div className="container">
          <h1>Amenities &amp; Facilities</h1>
          <p>Everything we provide to make your stay comfortable and memorable</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-eyebrow">What We Offer</span>
            <div className="section-divider"><span style={{ color: 'var(--color-accent)' }}>✦</span></div>
            <h2>Property Highlights</h2>
            <p>Premium amenities ensuring the perfect experience for every occasion</p>
          </div>

          {loading && <SkeletonGrid count={6} columns={3} height="120px" />}
          {error   && <InlineError message={error} />}

          {!loading && !error && (
            <div className="grid-3">
              {amenities.map((amenity, i) => (
                <div
                  key={amenity.id}
                  className={`card card-body reveal reveal-delay-${(i % 5) + 1}`}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--space-5)',
                    transition: 'transform 0.25s, box-shadow 0.25s',
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 60,
                    height: 60,
                    borderRadius: 'var(--radius-lg)',
                    background: 'linear-gradient(135deg, var(--color-soft) 0%, rgba(166,90,58,0.08) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary)',
                    flexShrink: 0,
                    border: '1px solid var(--color-border)',
                  }}>
                    {getIcon(amenity.icon, 24)}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--fw-semibold)',
                      color: 'var(--color-secondary)',
                      marginBottom: 'var(--space-2)',
                      lineHeight: 1.3,
                    }}>
                      {amenity.name}
                    </h4>
                    {amenity.description && (
                      <p style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-muted)',
                        lineHeight: 1.6,
                      }}>
                        {amenity.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && amenities.length === 0 && (
            <div className="text-center" style={{ padding: 'var(--space-16)', color: 'var(--color-muted)' }}>
              <p>Amenities information coming soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Highlight strip */}
      {!loading && amenities.length > 0 && (
        <section className="section-alt">
          <div className="container">
            <div style={{
              background: 'var(--color-secondary)',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--space-10)',
              textAlign: 'center',
            }}>
              <h3 style={{ color: '#FFFFFF', marginBottom: 'var(--space-4)' }}>
                Everything you need — all included
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 560, margin: '0 auto var(--space-6)', fontSize: 'var(--text-sm)' }}>
                No hidden charges. The entire property with all its amenities is available
                exclusively for your group during your stay.
              </p>
              <a className="btn btn-accent" href="/rooms">Book Now</a>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
