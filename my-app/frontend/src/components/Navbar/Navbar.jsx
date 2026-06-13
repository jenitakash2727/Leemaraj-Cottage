import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  FiHome, FiInfo, FiGrid, FiPackage, FiStar,
  FiImage, FiCalendar, FiPhone, FiMenu, FiX, FiUser
} from 'react-icons/fi';
import { supabase } from '../../supabaseClient';
import './Navbar.css';

const navItems = [
  { label: 'Home',      path: '/',          icon: FiHome },
  { label: 'About',     path: '/about',     icon: FiInfo },
  { label: 'Rooms',     path: '/rooms',     icon: FiGrid },
  { label: 'Group Booking', path: '/group-booking', icon: FiPackage },
  { label: 'Amenities', path: '/amenities', icon: FiStar },
  { label: 'Gallery',   path: '/gallery',   icon: FiImage },
  { label: 'Contact',   path: '/contact',   icon: FiPhone },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen]   = useState(false);
  const [isScrolled, setIsScrolled]   = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  const token = localStorage.getItem('access_token');
  const isAdmin = localStorage.getItem('is_admin') === 'true';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    navigate('/');
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Scroll-based shadow
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Close menu when clicking outside
  const handleOverlayClick = useCallback(() => setIsMenuOpen(false), []);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="navbar__container">

          {/* ── Logo ─────────────────────────────── */}
          <button
            className="navbar__logo"
            onClick={() => navigate('/')}
            aria-label="Go to homepage"
          >
            <div className="navbar__logo-icon">LRC</div>
            <div className="navbar__logo-text">
              <span className="navbar__logo-name">Leema Raj Cottage Stay</span>
            </div>
          </button>

          {/* ── Desktop Nav Links ─────────────────── */}
          <ul className="navbar__menu">
            {navItems.map(({ label, path }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  end={path === '/'}
                  className={({ isActive }) =>
                    `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* ── Auth Actions ────────────────── */}
          <div className="navbar__actions">
            {!token ? (
              <button
                className="navbar__admin-btn hide-on-mobile"
                onClick={() => navigate('/login')}
                aria-label="Login"
              >
                <FiUser size={15} />
                <span>Login</span>
              </button>
            ) : isAdmin ? (
              <>
                <button className="navbar__admin-btn hide-on-mobile" onClick={() => navigate('/admin')}>
                  Admin Dashboard
                </button>
                <button className="navbar__admin-btn hide-on-mobile" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button className="navbar__admin-btn hide-on-mobile" onClick={() => navigate('/my-bookings')}>
                  My Bookings
                </button>
                <button className="navbar__admin-btn hide-on-mobile" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}

            {/* ── Hamburger ────────────────────────── */}
            <button
              className="navbar__hamburger"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ────────────────────────── */}
      <div className={`navbar__drawer ${isMenuOpen ? 'navbar__drawer--open' : ''}`} role="dialog" aria-modal="true">
        <div className="navbar__drawer-header">
          <span className="navbar__drawer-title">Leema Raj Cottage Stay</span>
          <button className="navbar__drawer-close" onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
            <FiX size={22} />
          </button>
        </div>

        <ul className="navbar__drawer-menu">
          {navItems.map(({ label, path, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  `navbar__drawer-link ${isActive ? 'navbar__drawer-link--active' : ''}`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="navbar__drawer-footer">
          {!token ? (
            <button
              className="btn btn-outline w-full"
              onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
              style={{ marginBottom: 'var(--space-3)' }}
            >
              <FiUser size={16} style={{ marginRight: '8px' }} />
              Login
            </button>
          ) : isAdmin ? (
            <>
              <button
                className="btn btn-outline w-full"
                onClick={() => { navigate('/admin'); setIsMenuOpen(false); }}
                style={{ marginBottom: 'var(--space-3)' }}
              >
                Admin Dashboard
              </button>
              <button
                className="btn btn-outline w-full"
                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                style={{ marginBottom: 'var(--space-3)', color: '#DC2626', borderColor: 'rgba(220,38,38,0.2)' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-outline w-full"
                onClick={() => { navigate('/my-bookings'); setIsMenuOpen(false); }}
                style={{ marginBottom: 'var(--space-3)' }}
              >
                My Bookings
              </button>
              <button
                className="btn btn-outline w-full"
                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                style={{ marginBottom: 'var(--space-3)', color: '#DC2626', borderColor: 'rgba(220,38,38,0.2)' }}
              >
                Logout
              </button>
            </>
          )}

          <button
            className="btn btn-primary w-full"
            onClick={() => { navigate('/rooms'); setIsMenuOpen(false); }}
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className="navbar__overlay"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navbar;
