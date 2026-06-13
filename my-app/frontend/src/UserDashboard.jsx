import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserDashboard.css';

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('access_token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bookings/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.put(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUserBookings();
      } catch (error) {
        console.error('Error cancelling booking:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    return badges[status] || 'status-pending';
  };

  if (loading) {
    return <div className="dashboard-loading">Loading your bookings...</div>;
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>My Dashboard</h1>
          <p>Welcome back, {user.full_name}!</p>
        </div>
        
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Bookings</h3>
            <p className="stat-number">{bookings.length}</p>
          </div>
          <div className="stat-card">
            <h3>Active Bookings</h3>
            <p className="stat-number">
              {bookings.filter(b => b.booking_status === 'confirmed').length}
            </p>
          </div>
        </div>
        
        <div className="bookings-section">
          <h2>My Bookings</h2>
          
          {bookings.length === 0 ? (
            <div className="no-bookings">
              <p>You haven't made any bookings yet.</p>
              <button className="btn-book-now" onClick={() => window.location.href = '/booking'}>
                Book Your Stay Now →
              </button>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <h3>Booking #{booking.id}</h3>
                    <span className={`status-badge ${getStatusBadge(booking.booking_status)}`}>
                      {booking.booking_status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="booking-details">
                    <div className="detail-row">
                      <span className="detail-label">Check-in:</span>
                      <span className="detail-value">{new Date(booking.check_in).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Check-out:</span>
                      <span className="detail-value">{new Date(booking.check_out).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Guests:</span>
                      <span className="detail-value">{booking.guests_count}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Room Type:</span>
                      <span className="detail-value">{booking.room_type}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Total Amount:</span>
                      <span className="detail-value amount">₹{booking.total_amount}</span>
                    </div>
                    {booking.special_requests && (
                      <div className="detail-row">
                        <span className="detail-label">Special Requests:</span>
                        <span className="detail-value">{booking.special_requests}</span>
                      </div>
                    )}
                  </div>
                  
                  {booking.booking_status === 'pending' && (
                    <div className="booking-actions">
                      <button 
                        className="btn-cancel" 
                        onClick={() => cancelBooking(booking.id)}
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;