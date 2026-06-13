import React, { useEffect, useState } from 'react';
import { FiCalendar, FiHome, FiMessageSquare, FiTrendingUp } from 'react-icons/fi';
import { getAdminStats, getAdminBookings } from '../../services/api';
import { LoadingSpinner, InlineError } from '../../components/Common/LoadingSpinner';
import { formatCurrency } from '../../utils/helpers';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      getAdminStats(),
      getAdminBookings({ status: 'confirmed' }) // for calendar
    ])
      .then(([statsRes, bookingsRes]) => {
        setStats(statsRes.data);
        setBookings(bookingsRes.data);
      })
      .catch(() => setError('Failed to load dashboard statistics.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;
  if (error) return <InlineError message={error} />;
  if (!stats) return null;

  // Prepare Chart Data
  const pieData = [
    { name: 'Pending', value: stats.bookings.pending, color: '#92400E' },
    { name: 'Confirmed', value: stats.bookings.confirmed, color: '#065F46' },
    { name: 'Cancelled', value: stats.bookings.cancelled, color: '#991B1B' },
    { name: 'Completed', value: stats.bookings.completed, color: '#3730A3' },
  ].filter(d => d.value > 0);

  // Very basic trend (for demonstration, normally this would be time-series data from backend)
  const barData = [
    { name: 'Today', bookings: stats.bookings.today },
    { name: 'This Month', bookings: stats.bookings.this_month },
    { name: 'Total', bookings: stats.bookings.total },
  ];

  // Calendar logic
  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      for (const b of bookings) {
        if (dateStr >= b.check_in_date && dateStr < b.check_out_date) {
          return 'calendar-booked-day'; // CSS to be added in Admin.css
        }
      }
    }
    return null;
  };

  const getTileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      const dayBookings = bookings.filter(b => b.check_in_date === dateStr);
      if (dayBookings.length > 0) {
        return (
          <div style={{ fontSize: 10, color: 'var(--color-primary)', fontWeight: 'bold' }}>
            {dayBookings.length} in
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 style={{ marginBottom: 'var(--space-2)' }}>Dashboard</h1>
          <p className="text-muted">Overview of your property and bookings.</p>
        </div>
        <div style={{ textAlign: 'right', background: 'var(--color-soft)', padding: 'var(--space-3) var(--space-5)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Estimated Revenue</div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
            {formatCurrency(stats.analytics.revenue_estimate)}
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="admin-stats-grid" style={{ marginBottom: 'var(--space-10)' }}>
        <div className="card card-body admin-stat-card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', color: 'var(--color-primary)' }}>
            <FiCalendar size={20} />
            <h3 style={{ margin: 0, fontSize: 'var(--text-lg)' }}>Bookings</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', textTransform: 'uppercase' }}>This Month</div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>{stats.bookings.this_month}</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', textTransform: 'uppercase' }}>Total</div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>{stats.bookings.total}</div>
            </div>
          </div>
        </div>

        <div className="card card-body admin-stat-card" style={{ borderLeft: '4px solid var(--color-accent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', color: 'var(--color-accent)' }}>
            <FiTrendingUp size={20} />
            <h3 style={{ margin: 0, fontSize: 'var(--text-lg)' }}>Popularity</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', textTransform: 'uppercase' }}>Top Room</div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={stats.analytics.popular_room}>
                {stats.analytics.popular_room}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', textTransform: 'uppercase' }}>Top Package</div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={stats.analytics.popular_package}>
                {stats.analytics.popular_package}
              </div>
            </div>
          </div>
        </div>

        <div className="card card-body admin-stat-card" style={{ borderLeft: '4px solid #4B5563' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', color: '#4B5563' }}>
            <FiMessageSquare size={20} />
            <h3 style={{ margin: 0, fontSize: 'var(--text-lg)' }}>Enquiries</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-4)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', textTransform: 'uppercase' }}>Total Unresolved</div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: stats.enquiries.unresolved > 0 ? '#DC2626' : '#065F46' }}>
                {stats.enquiries.unresolved}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-stats-grid" style={{ marginBottom: 'var(--space-10)', alignItems: 'start' }}>
        {/* Booking Calendar */}
        <div className="card card-body admin-stat-card">
          <h3 style={{ marginBottom: 'var(--space-4)' }}>Availability Calendar</h3>
          <p className="text-muted" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>Highlights dates with confirmed bookings.</p>
          <div className="custom-calendar-container" style={{ display: 'flex', justifyContent: 'center' }}>
            <Calendar 
              tileClassName={getTileClassName}
              tileContent={getTileContent}
            />
          </div>
        </div>

        {/* Analytics Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className="card card-body admin-stat-card dashboard-chart-card">
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Booking Status Distribution</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={pieData} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={60} 
                    outerRadius={80} 
                    dataKey="value" 
                    stroke="none"
                    labelLine={false} // Disable labels pointing to slices on small screens
                  >
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px', whiteSpace: 'nowrap' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card card-body admin-stat-card dashboard-chart-card">
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Booking Trends</h3>
            <div className="chart-wrapper">
              {barData.every(d => d.bookings === 0) ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-muted)' }}>
                  No booking trend data available yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip cursor={{ fill: 'var(--color-soft)' }} />
                    <Bar dataKey="bookings" fill="var(--color-primary)" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Bookings ── */}
      <h2 style={{ marginBottom: 'var(--space-4)' }}>Recent Bookings</h2>
      
      {/* Desktop Table */}
      <div className="admin-table-scroll desktop-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ref</th>
              <th>Guest Name</th>
              <th>Type</th>
              <th>Check In</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.recent_bookings?.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-muted)' }}>
                  No recent bookings.
                </td>
              </tr>
            ) : (
              stats.recent_bookings?.map(b => (
                <tr key={b.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{b.booking_reference}</td>
                  <td>{b.full_name}</td>
                  <td>{b.booking_type}</td>
                  <td>{b.check_in_date}</td>
                  <td>
                    <span className={`status-badge status-badge--${b.status}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="mobile-records-list">
        {stats.recent_bookings?.length === 0 ? (
          <div className="mobile-record-card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            No recent bookings.
          </div>
        ) : (
          stats.recent_bookings?.map(b => (
            <div key={b.id} className="mobile-record-card">
              <div className="mobile-record-row">
                <div className="mobile-record-label">Ref</div>
                <div className="mobile-record-value" style={{ fontFamily: 'monospace', fontWeight: 600 }}>{b.booking_reference}</div>
              </div>
              <div className="mobile-record-row">
                <div className="mobile-record-label">Guest Name</div>
                <div className="mobile-record-value">{b.full_name}</div>
              </div>
              <div className="mobile-record-row">
                <div className="mobile-record-label">Type</div>
                <div className="mobile-record-value">{b.booking_type}</div>
              </div>
              <div className="mobile-record-row">
                <div className="mobile-record-label">Check In</div>
                <div className="mobile-record-value">{b.check_in_date}</div>
              </div>
              <div className="mobile-record-row">
                <div className="mobile-record-label">Status</div>
                <div className="mobile-record-value">
                  <span className={`status-badge status-badge--${b.status}`}>{b.status}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
