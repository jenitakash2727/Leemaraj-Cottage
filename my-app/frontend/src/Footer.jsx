import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { Home, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon"><Home size={28} /></span>
              <span>Panna Cottage</span>
            </div>
            <p>Experience the perfect blend of luxury and wilderness at Panna's finest cottage.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/amenities">Amenities</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <ul>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Facebook</a></li>
              <li><a href="#">TripAdvisor</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Newsletter</h4>
            <p>Subscribe for offers & updates</p>
            <div className="newsletter">
              <input type="email" placeholder="Your email" />
              <button><ArrowRight size={20} /></button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Panna Cottage. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;