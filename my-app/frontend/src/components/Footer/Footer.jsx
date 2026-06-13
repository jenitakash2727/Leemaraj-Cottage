import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiPhone, FiMapPin, FiInstagram,
  FiFacebook, FiYoutube
} from 'react-icons/fi';
import { MdWhatsapp } from 'react-icons/md';
import './Footer.css';

const PHONE_NUMBERS = [
  { number: '7845671542', display: '+91 78456 71542' },
  { number: '8122750542', display: '+91 81227 50542' },
  { number: '9597350542', display: '+91 95973 50542' },
];

const quickLinks = [
  { label: 'Home',      path: '/' },
  { label: 'About Us',  path: '/about' },
  { label: 'Rooms & Tariff', path: '/rooms' },
  { label: 'Group Packages', path: '/packages' },
  { label: 'Amenities', path: '/amenities' },
  { label: 'Gallery',   path: '/gallery' },
  { label: 'Contact',   path: '/contact' },
];

const Footer = () => {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__main">
        <div className="container">
          <div className="footer__grid">

            {/* ── Brand Column ───────────────────── */}
            <div className="footer__brand">
              <div className="footer__logo">
                <div className="footer__logo-icon">LRC</div>
                <div>
                  <div className="footer__logo-name">Leema Raj Cottage Stay</div>
                </div>
              </div>
              <p className="footer__tagline">
                A Comfortable Stay for Family Gatherings, Weddings, Functions,
                Temple Visits, Picnics &amp; Group Outings.
              </p>
              <div className="footer__social">
                <a href="https://wa.me/917845671542" className="footer__social-icon" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
                  <MdWhatsapp size={18} />
                </a>
                <a href="https://maps.google.com" className="footer__social-icon" aria-label="Google Maps" target="_blank" rel="noopener noreferrer">
                  <FiMapPin size={18} />
                </a>
                <a href="mailto:contact@leemaraj.com" className="footer__social-icon" aria-label="Email" target="_blank" rel="noopener noreferrer">
                  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </a>
              </div>
            </div>

            {/* ── Quick Links ────────────────────── */}
            <div className="footer__col">
              <h4 className="footer__col-title">Quick Links</h4>
              <ul className="footer__links">
                {quickLinks.map(({ label, path }) => (
                  <li key={path}>
                    <button
                      className="footer__link"
                      onClick={() => navigate(path)}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Contact Column ─────────────────── */}
            <div className="footer__col">
              <h4 className="footer__col-title">Contact Us</h4>
              <ul className="footer__contact-list">
                {PHONE_NUMBERS.map(({ number, display }) => (
                  <li key={number} className="footer__contact-item">
                    <FiPhone size={15} className="footer__contact-icon" />
                    <a href={`tel:${number}`} className="footer__contact-link">
                      {display}
                    </a>
                  </li>
                ))}
                <li className="footer__contact-item">
                  <FiMapPin size={15} className="footer__contact-icon" />
                  <span className="footer__contact-text">Tamil Nadu, India</span>
                </li>
              </ul>

              {/* Quick call buttons */}
              <div className="footer__call-btns">
                <a
                  href={`tel:${PHONE_NUMBERS[0].number}`}
                  className="footer__call-btn"
                >
                  <FiPhone size={14} />
                  Call Now
                </a>
                <a
                  href={`https://wa.me/91${PHONE_NUMBERS[0].number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__call-btn footer__call-btn--whatsapp"
                >
                  <MdWhatsapp size={16} />
                  WhatsApp
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Bottom Bar ─────────────────────────── */}
      <div className="footer__bottom">
        <div className="container">
          <div className="footer__bottom-inner">
            <p className="footer__copyright">
              &copy; {year} Leema Raj Cottage Stay. All rights reserved.
            </p>
            <div className="footer__bottom-links">
              <button className="footer__bottom-link" onClick={() => navigate('/contact')}>
                Privacy Policy
              </button>
              <span className="footer__dot" aria-hidden="true">·</span>
              <button className="footer__bottom-link" onClick={() => navigate('/contact')}>
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
