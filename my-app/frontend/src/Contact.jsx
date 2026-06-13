import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for contacting us! We will get back to you within 24 hours.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <>
      <div className="page-header">
        <h1>Contact Us</h1>
        <p>Get in touch with us for bookings, inquiries, or any assistance</p>
      </div>
      
      <section className="contact-page">
        <div className="container">
          <div className="contact-wrapper">
            <div className="contact-info">
              <div className="info-card">
                <h3>📍 Visit Our Cottage</h3>
                <div className="info-details">
                  <div className="info-item">
                    <div className="info-icon">📍</div>
                    <div className="info-content">
                      <strong>Address</strong>
                      <p>Near Ken River, Panna Tiger Reserve,<br />Madhya Pradesh - 488001, India</p>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-icon">📞</div>
                    <div className="info-content">
                      <strong>Phone Number</strong>
                      <p>+91 98765 43210</p>
                      <p>+91 98765 43211</p>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-icon">✉️</div>
                    <div className="info-content">
                      <strong>Email Address</strong>
                      <p>stay@pannacottage.com</p>
                      <p>reservations@pannacottage.com</p>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-icon">⏰</div>
                    <div className="info-content">
                      <strong>Working Hours</strong>
                      <p>Monday - Sunday: 24/7</p>
                      <p>Check-in: 12:00 PM | Check-out: 10:00 AM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="map-card">
                <div className="map-icon">🗺️</div>
                <h4>Find Us Here</h4>
                <p>Just 2km from Panna Tiger Reserve Main Gate</p>
                <button className="map-btn">Get Directions →</button>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <h3>Send Us a Message</h3>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <select name="subject" className="form-select" value={formData.subject} onChange={handleChange}>
                  <option value="">Select Inquiry Type</option>
                  <option value="booking">Booking Inquiry</option>
                  <option value="availability">Availability Check</option>
                  <option value="customization">Custom Package</option>
                  <option value="other">Other Questions</option>
                </select>
              </div>
              
              <div className="form-group">
                <textarea
                  name="message"
                  rows="5"
                  placeholder="Tell us about your stay, dates, number of guests, or any special requests..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="btn-submit">
                Send Message <span className="arrow">→</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;