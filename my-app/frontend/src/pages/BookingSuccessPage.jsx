import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiPhone } from 'react-icons/fi';
import { MdWhatsapp } from 'react-icons/md';
import { useScrollReveal } from '../AnimationUtils';

export default function BookingSuccessPage() {
  useScrollReveal();
  const location = useLocation();
  const navigate = useNavigate();
  const reference = location.state?.reference || location.state?.bookingRef;
  const bookingDetails = location.state?.bookingDetails || {};

  const handleWhatsApp = () => {
    const text = `Hello Leema Raj Cottage Stay,\n\nI have just submitted a booking request. My reference is *${reference}*.\nName: ${bookingDetails.full_name}\nDates: ${bookingDetails.check_in_date} to ${bookingDetails.check_in_date}\nGuests: ${bookingDetails.number_of_guests}`;
    window.open(`https://wa.me/917845671542?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <main className="page-wrapper">
      <section className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: 600, textAlign: 'center' }}>
          <div className="card card-body reveal" style={{ padding: 'var(--space-12)' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(166,90,58,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto var(--space-6)',
              color: 'var(--color-primary)'
            }}>
              <FiCheckCircle size={40} />
            </div>

            <h2 style={{ marginBottom: 'var(--space-4)' }}>Booking Request Submitted!</h2>

            <p className="text-muted" style={{ marginBottom: 'var(--space-6)', lineHeight: 1.7 }}>
              Thank you for choosing Leema Raj Cottage Stay.
              {reference ? (
                <>
                  <br />Your booking reference is:{' '}
                  <strong style={{ color: 'var(--color-primary)', fontSize: 'var(--text-lg)', marginLeft: 4 }}>
                    {reference}
                  </strong>
                </>
              ) : ''}
              <br />Our team will contact you shortly to confirm your booking and arrange payment.
            </p>

            <div style={{ background: 'var(--color-soft)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', marginBottom: 'var(--space-8)' }}>
              <p style={{ fontWeight: 600, marginBottom: 'var(--space-4)' }}>Need immediate assistance?</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {['7845671542', '8122750542', '9597350542'].map(num => (
                  <a key={num} href={`tel:${num}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                    <FiPhone size={16} /> +91 {num}
                  </a>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => navigate('/')}>Return to Home</button>
              <button className="btn btn-outline" onClick={() => navigate('/contact')}>Contact Us</button>
              <button className="btn" style={{ background: '#25D366', color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }} onClick={handleWhatsApp}>
                <MdWhatsapp size={18} /> Send Booking Details via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
