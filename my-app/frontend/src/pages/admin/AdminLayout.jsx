import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  FiGrid, FiCalendar, FiHome, FiPackage, FiCoffee,
  FiImage, FiFileText, FiMessageSquare, FiLogOut, FiMenu, FiX, FiGlobe
} from 'react-icons/fi';
import { supabase } from '../../supabaseClient';
import './Admin.css';

const NAV_ITEMS = [
  { path: '/admin',            label: 'Dashboard', icon: FiGrid, exact: true },
  { path: '/admin/bookings',   label: 'Bookings',  icon: FiCalendar },
  { path: '/admin/rooms',      label: 'Rooms',     icon: FiHome },
  { path: '/admin/group-booking', label: 'Group Bookings', icon: FiPackage },
  { path: '/admin/gallery',    label: 'Gallery',   icon: FiImage },
  { path: '/admin/policies',   label: 'Policies',  icon: FiFileText },
  { path: '/admin/enquiries',  label: 'Enquiries', icon: FiMessageSquare },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState('Administrator');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminInitials, setAdminInitials] = useState('A');

  useEffect(() => {
    const storedName = localStorage.getItem('admin_name');
    const storedEmail = localStorage.getItem('admin_email');
    
    let displayName = 'Administrator';
    if (storedName) {
      displayName = storedName;
    } else if (storedEmail) {
      displayName = storedEmail;
    }
    setAdminName(displayName);
    if (storedEmail) setAdminEmail(storedEmail);
    if (displayName) setAdminInitials(displayName.charAt(0).toUpperCase());
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="admin-layout">
      {/* ── Sidebar ── */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>LRC</div>
            <span style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }}>Admin</span>
          </div>
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(false)}>
            <FiX size={24} />
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Bottom Profile */}
        <div style={{ marginTop: 'auto', padding: 'var(--space-6)', borderTop: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-primary)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 16 }}>{adminInitials}</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{adminName}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{adminEmail || 'Super Admin'}</div>
            </div>
          </div>
          <button className="btn btn-outline w-full" onClick={handleLogout} style={{ justifyContent: 'center', color: '#DC2626', borderColor: 'rgba(220,38,38,0.2)' }}>
            <FiLogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main Content ── */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
              <FiMenu size={24} />
            </button>
            <h2 style={{ fontSize: 'var(--text-lg)', margin: 0, fontWeight: 600, textTransform: 'capitalize' }}>
              {location.pathname.split('/').pop() === 'admin' ? 'Dashboard' : location.pathname.split('/').pop()}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/')} style={{ color: 'var(--color-primary)', borderColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiGlobe size={16} /> <span className="hide-on-mobile">View Website</span>
            </button>
            <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }}></div>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-muted)', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Welcome, {adminName}</span>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ color: 'var(--color-muted)', padding: 'var(--space-2)' }} aria-label="Logout">
              <FiLogOut size={20} />
            </button>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
