import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiArrowRight, FiCheckCircle, FiUsers, FiClock, FiPhone, FiHome, FiDollarSign, FiFileText, FiWifi, FiTv, FiShield, FiStar } from 'react-icons/fi';

import HeroSection from '../components/Home/HeroSection';
import { SkeletonGrid } from '../components/Common/SkeletonLoaders';
import { getIcon } from '../utils/iconMapper';
import { getRooms, getPackages, getAmenities, getPolicies } from '../services/api';
import { getImageUrl, formatCurrency } from '../utils/helpers';
import { useScrollReveal } from '../AnimationUtils';
import { FALLBACK_ROOMS, FALLBACK_PACKAGES, FALLBACK_AMENITIES, FALLBACK_POLICIES } from '../utils/fallbackData';

// Local image fallbacks removed

function CountUp({ end, suffix="" }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end]);
  return <span>{count}{suffix}</span>;
}

export default function HomePage() {
  useScrollReveal();
  const navigate = useNavigate();

  const [rooms,     setRooms]     = useState([]);
  const [packages,  setPackages]  = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [policies,  setPolicies]  = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.allSettled([
      getRooms().then(r => setRooms(r.data?.length ? r.data : FALLBACK_ROOMS)).catch(() => setRooms(FALLBACK_ROOMS)),
      getPackages().then(r => setPackages(r.data?.length ? r.data : FALLBACK_PACKAGES)).catch(() => setPackages(FALLBACK_PACKAGES)),
      getAmenities().then(r => setAmenities(r.data?.length ? r.data : FALLBACK_AMENITIES)).catch(() => setAmenities(FALLBACK_AMENITIES)),
      getPolicies().then(r => setPolicies(r.data?.length ? r.data : FALLBACK_POLICIES)).catch(() => setPolicies(FALLBACK_POLICIES)),
    ]).finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <Helmet>
        <title>Leema Raj Cottage Stay | Luxury Rooms &amp; Group Booking</title>
        <meta name="description" content="A comfortable stay for family gatherings, weddings, temple visits, and picnics. Fully air-conditioned rooms, 65-inch Smart TV, and pure RO drinking water." />
        <meta property="og:title" content="Leema Raj Cottage Stay" />
        <meta property="og:description" content="Perfect for family functions and group outings in a spacious, peaceful environment." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* ── 1. Hero ───────────────────────────── */}
      <HeroSection />


      {/* ── 2. Highlights / Amenities ────────── */}
      <section id="highlights" className="section" style={{ background: '#FFFFFF' }}>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-eyebrow">Property Highlights</span>
            <div className="section-divider"><span style={{ color: 'var(--color-accent)' }}>✦</span></div>
            <h2>Why Choose Us</h2>
            <p>Premium amenities ensuring a comfortable and memorable stay</p>
          </div>

          <div className="grid-3 mb-12">
            {[
              { icon: <FiHome />, title: '5 Spacious Rooms', desc: 'Ample space for large families and groups.' },
              { icon: <FiCheckCircle />, title: 'Fully Air Conditioned', desc: 'Beat the heat with modern ACs in all rooms.' },
              { icon: <FiWifi />, title: 'Free High-Speed WiFi', desc: 'Stay connected throughout the property.' },
              { icon: <FiTv />, title: 'Smart TVs', desc: 'Entertainment ready with 65" Smart TVs.' },
              { icon: <FiShield />, title: 'Secure Parking', desc: 'Ample and secure parking space available.' },
              { icon: <FiUsers />, title: 'Family Friendly', desc: 'Safe and peaceful environment for all ages.' },
            ].map((item, i) => (
              <div key={i} className={`card card-body reveal reveal-delay-${(i % 3) + 1}`} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ background: 'var(--color-soft)', color: 'var(--color-primary)', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {React.cloneElement(item.icon, { size: 24 })}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-secondary)' }}>{item.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-muted)', marginTop: 4 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="section-header reveal" style={{ marginTop: 'var(--space-16)' }}>
            <span className="section-eyebrow">Perfect For</span>
            <h2>Luxury Stays Designed For</h2>
          </div>

          {loading ? (
            <SkeletonGrid count={3} />
          ) : (
            <div className="grid-3">
              {amenities.slice(0, 3).map((a, i) => (
                <div
                  key={a.id}
                  className={`card card-body reveal reveal-delay-${(i % 3) + 1}`}
                  style={{ textAlign: 'center', padding: 'var(--space-8)' }}
                >
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: 'var(--color-soft)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-primary)', margin: '0 auto var(--space-4)'
                  }}>
                    {getIcon(a.icon, 28)}
                  </div>
                  <h4 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)', color: 'var(--color-secondary)' }}>
                    {a.name}
                  </h4>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', lineHeight: 1.5 }}>
                    {a.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="text-center" style={{ marginTop: 'var(--space-10)' }}>
            <button className="btn btn-outline" onClick={() => navigate('/amenities')}>
              View All Amenities <FiArrowRight style={{ marginLeft: 4 }} />
            </button>
          </div>
        </div>
      </section>

      {/* ── 3. Group Booking Preview ─────────── */}
      <section className="section-alt">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-eyebrow">Entire Cottage Booking</span>
            <div className="section-divider"><span style={{ color: 'var(--color-accent)' }}>✦</span></div>
            <h2>Group Booking</h2>
            <p>Special rates for groups — no hidden charges, no extra fees</p>
          </div>

          {loading ? (
            <SkeletonGrid count={3} />
          ) : (
            <div className="grid-3">
              {packages.map((pkg, i) => (
                <div
                  key={pkg.id}
                  className={`card card-body text-center reveal reveal-delay-${i + 1}`}
                  style={{ border: i === 1 ? '2px solid var(--color-accent)' : undefined, position: 'relative' }}
                >
                  {i === 1 && (
                    <span className="badge badge-accent" style={{ position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)' }}>
                      Popular
                    </span>
                  )}
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'var(--color-soft)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto var(--space-4)', color: 'var(--color-primary)'
                  }}>
                    <FiUsers size={24} />
                  </div>
                  <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>{pkg.guest_range}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--color-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                    <FiClock size={13} /> {pkg.duration}
                  </div>
                  <div style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
                    {formatCurrency(pkg.price)}
                  </div>
                  {pkg.no_extra_charges && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#15803d', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)', fontWeight: 600 }}>
                      <FiCheckCircle size={14} /> No Extra Charges
                    </div>
                  )}
                  <button className="btn btn-primary w-full" onClick={() => navigate('/group-booking/details')}>
                    View Group Booking
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ── 4. Rooms Preview ──────────────────── */}
      <section className="section" style={{ background: '#FFFFFF' }}>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-eyebrow">Accommodation</span>
            <div className="section-divider"><span style={{ color: 'var(--color-accent)' }}>✦</span></div>
            <h2>Rooms &amp; Tariff</h2>
            <p>All rooms fully air-conditioned with 65" Smart TV and premium teakwood beds</p>
          </div>

          {loading ? (
            <SkeletonGrid count={3} />
          ) : (
            <div className="grid-3">
              {rooms.map((room, i) => (
                <div key={room.id} className={`card room-card reveal reveal-delay-${i + 1}`}>
                  {/* Room image or placeholder */}
                  <div className="img-zoom-wrapper" style={{ height: 240, background: 'var(--color-soft)' }}>
                    {room.main_image_url || (room.images && room.images.length > 0 ? room.images[0].image_url : getImageUrl(room.image_url)) ? (
                      <img src={room.main_image_url || (room.images && room.images.length > 0 ? room.images[0].image_url : getImageUrl(room.image_url))} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)' }}>
                        <FiHome size={48} />
                      </div>
                    )}
                  </div>
                  <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                      <h3 style={{ fontSize: 'var(--text-xl)', margin: 0 }}>{room.name}</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: '12px' }}>
                      <span>{room.floor || 'Ground Floor'}</span>
                      <span>•</span>
                      <span>{room.area_sqft || '250'} sq ft</span>
                      <span>•</span>
                      <span>Up to {room.suitable_guests} Guests</span>
                    </div>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', marginBottom: 'var(--space-4)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {room.additional_guest_info || 'A comfortable and spacious room with premium amenities.'}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', color: 'var(--color-primary)', fontWeight: 700 }}>
                        {formatCurrency(room.price_per_day)}<span style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-body)', color: 'var(--color-muted)', fontWeight: 400 }}>/day</span>
                      </div>
                      <button className="btn btn-outline" onClick={() => navigate(`/rooms/${room.id}`)}>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center" style={{ marginTop: 'var(--space-10)' }}>
            <button className="btn btn-outline" onClick={() => navigate('/rooms')}>
              View All Rooms <FiArrowRight style={{ marginLeft: 4 }} />
            </button>
          </div>
        </div>
      </section>

      {/* ── 5. Trust & Social Proof ───────────── */}
      <section className="section-alt">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-eyebrow">Reviews</span>
            <div className="section-divider"><span style={{ color: 'var(--color-accent)' }}>✦</span></div>
            <h2>What Our Guests Say</h2>
            <p>120+ Happy Guests have enjoyed their stay with us</p>
          </div>
          
          <div className="grid-3">
            {[
              { name: 'Karthik S.', review: 'Amazing place for our family get-together! The rooms are huge, AC works perfectly, and the hospitality was top notch. Highly recommended.', rating: 5 },
              { name: 'Priya M.', review: 'We booked the entire cottage for a wedding function. It was so convenient and peaceful. The WiFi was fast, and the smart TVs kept the kids entertained.', rating: 5 },
              { name: 'Ramesh R.', review: 'Very clean and luxurious stay at a reasonable price. The parking space was very helpful for our group of 4 cars. Will definitely visit again.', rating: 5 },
            ].map((rev, i) => (
              <div key={i} className={`card card-body reveal reveal-delay-${(i % 3) + 1}`} style={{ background: '#fff' }}>
                <div style={{ display: 'flex', color: '#fbbf24', marginBottom: '12px' }}>
                  {[...Array(rev.rating)].map((_, idx) => <FiStar key={idx} fill="currentColor" />)}
                </div>
                <p style={{ fontSize: '0.95rem', fontStyle: 'italic', color: 'var(--color-text)', marginBottom: '16px', lineHeight: 1.6 }}>"{rev.review}"</p>
                <div style={{ fontWeight: 'bold', color: 'var(--color-secondary)' }}>- {rev.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Final CTA ──────────────────────── */}
      <section style={{
        background: `linear-gradient(135deg, var(--color-secondary) 0%, #1a2638 100%)`,
        padding: 'var(--space-24) var(--space-6)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23D8A34D\' fill-opacity=\'0.04\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="container" style={{ position: 'relative' }}>
          <span style={{ display: 'inline-block', fontSize: 'var(--text-sm)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 'var(--space-4)' }}>
            Limited Availability
          </span>
          <h2 style={{ color: '#FFFFFF', fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 'var(--space-4)' }}>
            Ready for an Unforgettable Stay?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 560, margin: '0 auto var(--space-10)', fontSize: 'var(--text-lg)', lineHeight: 1.7 }}>
            Book now and enjoy the entire property for your family or group.
            No hidden charges. Peaceful and private environment.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-8)' }}>
            <button className="btn btn-accent btn-lg" onClick={() => navigate('/rooms')}>
              Book Now
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => navigate('/contact')}>
              Contact Us
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
            {['7845671542', '8122750542', '9597350542'].map(num => (
              <a key={num} href={`tel:${num}`} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-sm)', textDecoration: 'none', transition: 'color 0.2s' }}>
                <FiPhone size={14} style={{ color: 'var(--color-accent)' }} /> {num}
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
