import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiPhone, FiMapPin, FiSend, FiCheckCircle } from 'react-icons/fi';
import { MdWhatsapp } from 'react-icons/md';
import { createEnquiry } from '../services/api';
import { isValidPhone } from '../utils/helpers';
import { InlineError } from '../components/Common/LoadingSpinner';
import { useScrollReveal } from '../AnimationUtils';
import { toast } from 'react-toastify';

const PHONES = [
  { number: '7845671542', display: '+91 78456 71542' },
  { number: '8122750542', display: '+91 81227 50542' },
  { number: '9597350542', display: '+91 95973 50542' },
];

export default function ContactPage() {
  useScrollReveal();
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const errors = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.message.trim()) errors.message = "Message is required";
    if (!form.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!isValidPhone(form.phone)) {
      errors.phone = "Phone number must be 10 digits";
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Invalid email format";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error('Please fill all required fields correctly.');
      return;
    }

    setSubmitting(true);
    try {
      await createEnquiry(form);
      setSuccess(true);
      toast.success('Your enquiry has been sent successfully.');
      setForm({ name: '', phone: '', email: '', message: '' });
    } catch (err) {
      if (err.response && err.response.data) {
        toast.error(typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data));
      } else {
        toast.error('Unable to send enquiry. Please try again later.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-wrapper">
      <Helmet>
        <title>Contact Us | Leema Raj Cottage Stay</title>
        <meta name="description" content="Get in touch to plan your stay at Leema Raj Cottage Stay. Call us, chat on WhatsApp, or send an enquiry directly." />
      </Helmet>

      <div className="compact-page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Get in touch — we're here to help you plan your stay</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'start', gap: 'var(--space-12)' }}>

            {/* Contact Info */}
            <div className="reveal-left">
              <span className="section-eyebrow">Reach Us</span>
              <h2 style={{ margin: 'var(--space-3) 0 var(--space-6)' }}>We're Here to Help</h2>
              <p className="text-muted" style={{ marginBottom: 'var(--space-8)' }}>
                Have questions about our rooms, group booking, or policies? Call us directly or send a message.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
                {PHONES.map(({ number, display }) => (
                  <a key={number} href={`tel:${number}`}
                    className="card card-body"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                      textDecoration: 'none', padding: 'var(--space-4) var(--space-5)',
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(8px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%',
                      background: 'var(--color-soft)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      color: 'var(--color-primary)', flexShrink: 0
                    }}>
                      <FiPhone size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginBottom: 2 }}>Call Us</div>
                      <div style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>{display}</div>
                    </div>
                  </a>
                ))}
              </div>

              {/* WhatsApp Button */}
              <a href="https://wa.me/917845671542" target="_blank" rel="noopener noreferrer"
                className="btn btn-primary w-full"
                style={{
                  marginBottom: 'var(--space-8)', background: '#25D366', borderColor: '#25D366',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)'
                }}
              >
                <MdWhatsapp size={20} /> Chat on WhatsApp
              </a>

              {/* Map placeholder */}
              <div style={{ background: 'var(--color-soft)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', textAlign: 'center', border: '1px dashed var(--color-border)' }}>
                <FiMapPin size={32} style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }} />
                <p className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>
                  Tamil Nadu, India<br />Exact location shared upon booking confirmation
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="card card-body reveal-right">
              <h3 style={{ marginBottom: 'var(--space-6)' }}>Send an Enquiry</h3>

              {success ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-8) 0' }}>
                  <FiCheckCircle size={48} style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }} />
                  <h4>Message Sent Successfully!</h4>
                  <p className="text-muted" style={{ marginTop: 'var(--space-2)' }}>
                    Thank you for reaching out. We will get back to you soon.
                  </p>
                  <button className="btn btn-outline" style={{ marginTop: 'var(--space-6)' }} onClick={() => setSuccess(false)}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && <InlineError message={error} />}

                  <div className="form-group">
                    <label className="form-label">Full Name <span style={{color:'red'}}>*</span></label>
                    <input
                      className="form-control"
                      placeholder="Your name"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                    {formErrors.name && <div style={{color:'red', fontSize:'12px', marginTop:'4px'}}>{formErrors.name}</div>}
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Phone <span style={{color:'red'}}>*</span></label>
                      <input
                        className="form-control"
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                      />
                      {formErrors.phone && <div style={{color:'red', fontSize:'12px', marginTop:'4px'}}>{formErrors.phone}</div>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        className="form-control"
                        type="email"
                        placeholder="Optional"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                      />
                      {formErrors.email && <div style={{color:'red', fontSize:'12px', marginTop:'4px'}}>{formErrors.email}</div>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message <span style={{color:'red'}}>*</span></label>
                    <textarea
                      className="form-control"
                      rows={5}
                      placeholder="How can we help you?"
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                    />
                    {formErrors.message && <div style={{color:'red', fontSize:'12px', marginTop:'4px'}}>{formErrors.message}</div>}
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg w-full" disabled={submitting} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)' }}>
                    {submitting ? 'Sending...' : <><FiSend size={16} /> Send Enquiry</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Business Enquiry CTA */}
      <section className="section-alt">
        <div className="container text-center reveal-scale">
          <h2 style={{ marginBottom: 'var(--space-4)' }}>For Business & Corporate Enquiries</h2>
          <p className="text-muted" style={{ maxWidth: 600, margin: '0 auto var(--space-6)' }}>
            Looking to host a corporate retreat, team-building event, or long-term stay? Contact our management team directly for custom group bookings and exclusive rates.
          </p>
          <a href="mailto:admin@festivalpetrothel.com" className="btn btn-outline btn-lg">
            Email Management
          </a>
        </div>
      </section>
    </main>
  );
}
