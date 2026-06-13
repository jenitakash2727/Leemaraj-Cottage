import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiArrowRight, FiInfo, FiMaximize, FiLayers } from 'react-icons/fi';
import { LoadingSpinner, InlineError } from '../components/Common/LoadingSpinner';
import { SkeletonGrid } from '../components/Common/SkeletonLoaders';
import { getRooms } from '../services/api';
import { getImageUrl, formatCurrency } from '../utils/helpers';
import { useScrollReveal } from '../AnimationUtils';
import ImageWithFallback from '../components/Common/ImageWithFallback';
import { FALLBACK_ROOMS } from '../utils/fallbackData';

export default function RoomsPage() {
  useScrollReveal();
  const navigate = useNavigate();
  const [rooms,   setRooms]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    getRooms()
      .then(res => {
        setRooms(res.data?.length ? res.data : FALLBACK_ROOMS);
      })
      .catch(err => {
        console.error('Failed to load rooms, using fallback.', err);
        setRooms(FALLBACK_ROOMS);
      })
      .finally(() => setLoading(false));
  }, []);

  const firstFloorRooms = rooms.filter(r => r.floor === 'First Floor');
  const groundFloorRooms = rooms.filter(r => r.floor === 'Ground Floor');

  const renderRooms = (floorRooms) => (
    <div className="grid-3" style={{ gap: 'var(--space-8)' }}>
      {floorRooms.map((room, i) => (
        <div
          key={room.id}
          className={`card room-card-premium reveal reveal-delay-${i + 1}`}
          onClick={() => navigate(`/rooms/${room.id}`)}
          style={{ cursor: 'pointer', transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
        >
          {/* Image */}
          <div className="img-zoom-wrapper" style={{ height: '260px', width: '100%', overflow: 'hidden' }}>
            {room.main_image_url || (room.images && room.images.length > 0 ? room.images[0].image_url : getImageUrl(room.image_url)) ? (
              <ImageWithFallback
                src={room.main_image_url || (room.images && room.images.length > 0 ? room.images[0].image_url : getImageUrl(room.image_url))}
                alt={room.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', background: 'var(--color-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)' }}>
                <span>No Image Available</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="card-body" style={{ padding: 'var(--space-4)', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, margin: '0 0 4px 0', color: 'var(--color-secondary)' }}>{room.name}</h3>
            </div>
            
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-muted)' }}>
              {room.floor || 'Ground Floor'} • {room.area_sqft || '250'} sq ft
            </p>

            <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: 'var(--color-text)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {room.description || 'A comfortable and spacious room with premium amenities.'}
            </p>

            <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>
                {formatCurrency(room.price_per_day)} <span style={{ fontWeight: 'normal', color: 'var(--color-muted)' }}>night</span>
              </div>
              <button className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.85rem' }} onClick={(e) => { e.stopPropagation(); navigate(`/rooms/${room.id}`); }}>
                Book
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <main className="page-wrapper">
      <Helmet>
        <title>Rooms &amp; Tariffs | Leema Raj Cottage Stay</title>
        <meta name="description" content="Explore our fully air-conditioned rooms featuring premium teakwood beds. Ideal for families and groups, starting at ₹2500/day." />
      </Helmet>

      {/* Banner */}
      <div className="compact-page-header">
        <div className="container">
          <h1>Rooms &amp; Tariff</h1>
          <p>Choose the perfect room for your stay — all rooms fully air-conditioned</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {loading && <SkeletonGrid count={6} columns={3} />}
          {error   && <InlineError message={error} />}

          {!loading && !error && (
            <>
              {firstFloorRooms.length > 0 && (
                <div style={{ marginBottom: 'var(--space-16)' }}>
                  <h3 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-8)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>First Floor Rooms</h3>
                  {renderRooms(firstFloorRooms)}
                </div>
              )}
              
              {groundFloorRooms.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-8)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>Ground Floor Rooms</h3>
                  {renderRooms(groundFloorRooms)}
                </div>
              )}
              
              {firstFloorRooms.length === 0 && groundFloorRooms.length === 0 && renderRooms(rooms)}
            </>
          )}

          {/* Info Note */}
          {!loading && (
            <div style={{ marginTop: 'var(--space-12)', padding: 'var(--space-6)', background: 'var(--color-soft)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
              <div style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: 4 }}><FiInfo size={24} /></div>
              <div>
                <h4 style={{ marginBottom: 'var(--space-2)' }}>Need help choosing?</h4>
                <p style={{ color: 'var(--color-muted)', fontSize: 'var(--text-sm)' }}>
                  Call us at <strong>+91 78456 71542</strong> for any queries related to number of members or stay arrangement.
                  Check-in permitted between <strong>5:00 AM – 10:00 PM</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
