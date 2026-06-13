import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiMapPin, FiClock } from 'react-icons/fi';
import './HeroSection.css';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="lux-hero" aria-label="Welcome to Leema Raj Cottage Stay">
      <div className="lux-hero__bg" aria-hidden="true" />
      <div className="lux-hero__overlay" aria-hidden="true" />

      <div className="lux-hero__content-wrapper container">
        <div className="lux-hero__content">
          <div className="lux-hero__label">
            <span className="lux-hero__line"></span>
            WELCOME TO LEEMA RAJ COTTAGE STAY
          </div>
          <h1 className="lux-hero__title">
            <span className="lux-hero__title-line">Experience Comfort,</span>
            <span className="lux-hero__title-line">Embrace Nature</span>
          </h1>
          <p className="lux-hero__desc">
            A peaceful retreat surrounded by nature.<br />
            Perfect for family stays, group getaways, weddings and unforgettable memories.
          </p>
          <div className="lux-hero__actions">
            <button className="lux-btn lux-btn-primary" onClick={() => navigate('/rooms')}>
              Book Now
            </button>
            <button className="lux-btn lux-btn-secondary" onClick={() => navigate('/rooms')}>
              View Rooms
            </button>
          </div>
        </div>
      </div>

      <div className="lux-hero__features-container">
        <div className="lux-hero__features">
          <div className="lux-feature">
            <FiHome className="lux-feature__icon" />
            <div className="lux-feature__text">
              <h4>Comfortable Rooms</h4>
              <p>Spacious and well-furnished rooms for a relaxing stay.</p>
            </div>
          </div>
          <div className="lux-feature">
            <FiUsers className="lux-feature__icon" />
            <div className="lux-feature__text">
              <h4>Ideal for Groups</h4>
              <p>Perfect for family gatherings, friends &amp; group bookings.</p>
            </div>
          </div>
          <div className="lux-feature">
            <FiMapPin className="lux-feature__icon" />
            <div className="lux-feature__text">
              <h4>Close to Nature</h4>
              <p>Wake up to greenery and breathe in peace.</p>
            </div>
          </div>
          <div className="lux-feature">
            <FiClock className="lux-feature__icon" />
            <div className="lux-feature__text">
              <h4>24/7 Support</h4>
              <p>We are here for you around the clock.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
