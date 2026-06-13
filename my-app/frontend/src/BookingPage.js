import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './BookingPage.css';

const BookingPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [formData, setFormData] = useState({
    guest_name: user.full_name || '',
    guest_email: user.email || '',
    guest_phone: user.phone || '',
    check_in: '',
    check_out: '',
    guests_count: 1,
    room_type: 'Standard',
    special_requests: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateNights = () => {
    if (formData.check_in && formData.check_out) {
      const checkIn = new Date(formData.check_in);
      const checkOut = new Date(formData.check_out);
      const diffTime = Math.abs(checkOut - checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const pricePerNight = formData.room_type === 'Deluxe' ? 8000 : 5000;
    return nights * pricePerNight;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/bookings',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccess(`Booking confirmed! Booking ID: ${response.data.booking_id}. Total amount: ₹${response.data.total_amount}`);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        <h1>Book Your Stay at Leemaraj Cottage</h1>
        <p>Fill in the details below to reserve your cottage</p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-section">
            <h3>Guest Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="guest_name"
                  value={formData.guest_name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="guest_email"
                  value={formData.guest_email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="guest_phone"
                value={formData.guest_phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-section">
            <h3>Stay Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Check-in Date *</label>
                <input
                  type="date"
                  name="check_in"
                  value={formData.check_in}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Check-out Date *</label>
                <input
                  type="date"
                  name="check_out"
                  value={formData.check_out}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Number of Guests *</label>
                <input
                  type="number"
                  name="guests_count"
                  min="1"
                  max="10"
                  value={formData.guests_count}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Room Type</label>
                <select name="room_type" value={formData.room_type} onChange={handleChange}>
                  <option value="Standard">Standard Cottage - ₹5000/night</option>
                  <option value="Deluxe">Deluxe Cottage - ₹8000/night</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Special Requests</h3>
            <div className="form-group">
              <textarea
                name="special_requests"
                rows="4"
                placeholder="Any special requests or requirements?"
                value={formData.special_requests}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          
          {formData.check_in && formData.check_out && (
            <div className="price-summary">
              <h3>Booking Summary</h3>
              <p>Number of nights: {calculateNights()}</p>
              <p>Price per night: ₹{formData.room_type === 'Deluxe' ? '8,000' : '5,000'}</p>
              <p className="total-amount">Total Amount: ₹{calculateTotal()}</p>
            </div>
          )}
          
          <button type="submit" className="btn-book-now" disabled={loading}>
            {loading ? 'Processing...' : 'Confirm Booking →'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;