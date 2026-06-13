import React from 'react';
import './Hero.css';
import { useScrollReveal, CountUp } from './AnimationUtils';

const Hero = ({ onBookNow }) => {
  useScrollReveal();
  
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="hero-wrapper">
      <section id="home" className="hero">
        <div className="hero-background"></div>
        <div className="hero-overlay"></div>
        
        <div className="hero-content reveal">
          <span className="hero-tagline">Experience True Luxury</span>
          <h1 className="hero-title">
            Welcome to <span className="highlight">Leemaraj</span> Cottage
          </h1>
          <p className="hero-subtitle">
            Your peaceful getaway • Complete privacy • Home away from home
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={onBookNow}>Book Now</button>
            <button className="btn-outline" onClick={scrollToAbout}>Explore More</button>
          </div>
        </div>

        <div className="hero-scroll" onClick={scrollToAbout}>
          <span>Scroll to explore</span>
          <div className="scroll-indicator"></div>
        </div>
      </section>

      {/* Floating Stats Card */}
      <div className="floating-stats-wrapper reveal reveal-delay-1">
        <div className="floating-stats">
          <div className="stat">
            <span className="stat-number"><CountUp end={4.9} decimals={1} /></span>
            <span className="stat-label">Guest Rating</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-number"><CountUp end={120} suffix="+" /></span>
            <span className="stat-label">Happy Guests</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
