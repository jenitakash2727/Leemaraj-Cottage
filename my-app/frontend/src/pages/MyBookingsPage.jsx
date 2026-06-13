import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getMyBookings } from '../services/api';
import { LoadingSpinner, InlineError } from '../components/Common/LoadingSpinner';
import { useScrollReveal } from '../AnimationUtils';
import { FiCalendar, FiClock } from 'react-icons/fi';

export default function MyBookingsPage() {
  useScrollReveal();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyBookings()
      .then(res => setBookings(res.data))
      .catch(err => {
        if (err.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Failed to load your bookings. Please try again later.');
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <main className="page-wrapper">
      <Helmet>
        <title>My Bookings | Leema Raj Cottage Stay</title>
      </Helmet>

      <div className="page-banner">
        <div className="container">
          <h1>My Bookings</h1>
          <p>View your past and upcoming stays</p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          {loading && <LoadingSpinner text="Loading your bookings..." />}
          {error && <InlineError message={error} />}

          {!loading && !error && bookings.length === 0 && (
            <div className="card card-body text-center reveal" style={{ padding: 'var(--space-12)' }}>
              <div style={{ color: 'var(--color-muted)', marginBottom: 'var(--space-4)' }}>
                <FiCalendar size={48} style={{ margin: '0 auto' }} />
              </div>
              <h3 style={{ marginBottom: 'var(--space-2)' }}>No Bookings Found</h3>
              <p className="text-muted" style={{ marginBottom: 'var(--space-6)' }}>You haven't made any bookings yet.</p>
              <button className="btn btn-primary" onClick={() => navigate('/rooms')}>Book Now</button>
            </div>
          )}

          {!loading && !error && bookings.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              {bookings.map((b, i) => (
                <div key={b.id} className={`card card-body reveal reveal-delay-${(i % 5) + 1}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                    <div>
                      <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-1)' }}>
                        {b.booking_type === 'room' ? 'Room Booking' : 'Group Package'}
                      </h3>
                      <div className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>
                        Ref: <strong style={{ color: 'var(--color-secondary)' }}>{b.booking_reference}</strong>
                      </div>
                    </div>
                    <span className={`badge ${b.status === 'confirmed' ? 'badge-primary' : b.status === 'cancelled' ? 'badge-accent' : ''}`} style={{ textTransform: 'capitalize' }}>
                      {b.status}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-muted)', fontSize: 'var(--text-sm)' }}>
                      <FiCalendar size={16} />
                      {b.check_in_date} to {b.check_out_date}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-muted)', fontSize: 'var(--text-sm)' }}>
                      <FiClock size={16} />
                      Check-in: {b.check_in_time}
                    </div>
                  </div>

                  <div style={{ padding: 'var(--space-4)', background: 'var(--color-soft)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' }}>
                    <strong>Guests:</strong> {b.number_of_guests} <br/>
                    <strong>Payment Option:</strong> {b.payment_option === 'advance' ? 'Pay Advance' : 'Pay Later'} <br/>
                    {b.total_estimated_amount && (
                      <><strong>Estimated Amount:</strong> ₹{b.total_estimated_amount}</>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
