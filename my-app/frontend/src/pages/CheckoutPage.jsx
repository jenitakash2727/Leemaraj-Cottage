import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiCheckCircle, FiInfo, FiArrowRight } from 'react-icons/fi';
import { getRooms, getPackages, checkAvailability, createBooking } from '../services/api';
import { getImageUrl, formatCurrency } from '../utils/helpers';
import { LoadingSpinner, InlineError } from '../components/Common/LoadingSpinner';
import { FALLBACK_ROOMS, FALLBACK_PACKAGES } from '../utils/fallbackData';
import { toast } from 'react-toastify';
import './CheckoutPage.css';

// Local fallbacks removed

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function CheckoutPage() {
  const query = useQuery();
  const navigate = useNavigate();
  const type = query.get('type'); // 'room' or 'group'
  const roomId = query.get('roomId');
  const packageId = query.get('packageId');
  const checkIn = query.get('checkIn');
  const checkOut = query.get('checkOut');
  const time = query.get('time') || '14:00';
  const initialGuests = query.get('guests') || '';

  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    alternate_phone: '',
    email: '',
    number_of_guests: initialGuests,
    message: '',
    agreed: false
  });

  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (type === 'room' && roomId) {
      getRooms()
        .then(res => {
          const data = res.data?.length ? res.data : FALLBACK_ROOMS;
          const found = data.find(r => r.id === parseInt(roomId));
          if (found) setItemData(found);
          else setError('Room not found.');
        })
        .catch(() => {
          const found = FALLBACK_ROOMS.find(r => r.id === parseInt(roomId));
          if (found) setItemData(found);
          else setError('Room not found.');
        })
        .finally(() => setLoading(false));
    } else if (type === 'group' && packageId) {
      getPackages()
        .then(res => {
          const data = res.data?.length ? res.data : FALLBACK_PACKAGES;
          const found = data.find(p => p.id === parseInt(packageId));
          if (found) setItemData(found);
          else setError('Package not found.');
        })
        .catch(() => {
          const found = FALLBACK_PACKAGES.find(p => p.id === parseInt(packageId));
          if (found) setItemData(found);
          else setError('Package not found.');
        })
        .finally(() => setLoading(false));
    } else {
      setError('Invalid checkout parameters.');
      setLoading(false);
    }
  }, [type, roomId, packageId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!form.full_name.trim()) errors.full_name = "Full name is required";
    if (!form.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (form.phone.replace(/\D/g, '').length < 10) {
      errors.phone = "Phone number must be at least 10 digits";
    }
    if (!form.alternate_phone.trim()) {
      errors.alternate_phone = "Additional phone number is required";
    } else if (form.alternate_phone.replace(/\D/g, '').length < 10) {
      errors.alternate_phone = "Additional phone number must be at least 10 digits";
    }
    if (type === 'group') {
      if (!form.number_of_guests) {
        errors.number_of_guests = "Number of guests is required";
      } else if (itemData && parseInt(form.number_of_guests) <= itemData.min_guest_count) {
        errors.number_of_guests = `Must be greater than ${itemData.min_guest_count}`;
      }
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error('Please fill all required fields correctly.');
      return;
    }

    if (!form.agreed) {
      toast.error("Please agree to the Terms and Conditions.");
      return;
    }

    if (!checkIn || !checkOut) {
      toast.error("Dates missing. Please go back and select dates.");
      return;
    }

    setShowConfirmModal(true);
  };

  const processBooking = async () => {
    setShowConfirmModal(false);
    setSubmitting(true);
    
    try {
      // 1. Double check availability
      const availRes = await checkAvailability({
        booking_type: type,
        room: type === 'room' ? roomId : undefined,
        guest_count: type === 'group' ? form.number_of_guests : undefined,
        check_in_date: checkIn,
        check_out_date: checkOut,
      });

      if (!availRes.data.available) {
        toast.error(availRes.data.message || "Unfortunately, it is no longer available for these dates.");
        setSubmitting(false);
        return;
      }

      // 2. Submit booking
      const payload = {
        booking_type: type,
        room: type === 'room' ? roomId : null,
        package: type === 'group' ? packageId : null,
        check_in_date: checkIn,
        check_out_date: checkOut,
        check_in_time: time,
        full_name: form.full_name,
        phone: form.phone,
        alternate_phone: form.alternate_phone,
        email: form.email,
        number_of_guests: form.number_of_guests || 1, // room booking default to 1 if empty
        message: form.message,
      };

      const res = await createBooking(payload);
      if (res.status === 201) {
        navigate('/booking-success', { state: { bookingRef: res.data.booking_reference, name: form.full_name } });
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      let msg = "Failed to submit booking.";
      if (err.response?.data) {
        msg = Object.values(err.response.data).map(v => Array.isArray(v) ? v[0] : v).join('\n');
      }
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <main className="page-wrapper"><div className="container" style={{paddingTop: 100}}><LoadingSpinner text="Preparing checkout..." /></div></main>;
  if (error || !itemData) return <main className="page-wrapper"><div className="container" style={{paddingTop: 100}}><InlineError message={error || "Item not found."} /></div></main>;

  const checkInDateObj = new Date(checkIn);
  const checkOutDateObj = new Date(checkOut);
  const diffTime = Math.abs(checkOutDateObj - checkInDateObj);
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  const price = type === 'room' ? itemData.price_per_day : itemData.price;
  const totalAmount = days * parseFloat(price);

  let imageUrl = null;
  if (type === 'room') {
    imageUrl = itemData.main_image_url || (itemData.images && itemData.images.length > 0 ? itemData.images[0].image_url : getImageUrl(itemData.image_url));
  }

  return (
    <main className="checkout-page">
      <Helmet>
        <title>Checkout | Leema Raj Cottage Stay</title>
      </Helmet>

      <div className="compact-page-header">
        <div className="container">
          <h1>Complete Your Booking</h1>
          <p>Review your selection and enter your details below.</p>
        </div>
      </div>

      <div className="checkout-wrapper">
        {/* Form Section */}
        <div className="checkout-form-section">
          <div style={{ background: 'var(--color-soft)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-8)', fontWeight: 600 }}>
            <FiInfo size={24} style={{ color: 'var(--color-primary)' }} />
            Your booking request will be confirmed by the owner. For any queries regarding accommodation, stay arrangements, group bookings, room details, or the number of guests, please contact us.
          </div>

          <h2>Guest Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name <span style={{color:'red'}}>*</span></label>
              <input type="text" className="form-control" name="full_name" value={form.full_name} onChange={handleChange} />
              {formErrors.full_name && <div style={{color:'red', fontSize:'12px', marginTop:'4px'}}>{formErrors.full_name}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone Number <span style={{color:'red'}}>*</span></label>
                <input type="tel" className="form-control" name="phone" value={form.phone} onChange={handleChange} minLength={10} maxLength={15} />
                {formErrors.phone && <div style={{color:'red', fontSize:'12px', marginTop:'4px'}}>{formErrors.phone}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Additional Phone Number <span style={{color:'red'}}>*</span></label>
                <input type="tel" className="form-control" name="alternate_phone" value={form.alternate_phone} onChange={handleChange} minLength={10} maxLength={15} />
                {formErrors.alternate_phone && <div style={{color:'red', fontSize:'12px', marginTop:'4px'}}>{formErrors.alternate_phone}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email (Optional)</label>
                <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Number of Guests {type === 'group' && <span style={{color:'red'}}>*</span>}</label>
                <input 
                  type="number" 
                  className="form-control" 
                  name="number_of_guests" 
                  value={form.number_of_guests} 
                  onChange={handleChange} 
                  min={type === 'group' && itemData ? itemData.min_guest_count + 1 : 1}
                  placeholder={type === 'group' && itemData ? `> ${itemData.min_guest_count}` : ''}
                />
                {formErrors.number_of_guests && <div style={{color:'red', fontSize:'12px', marginTop:'4px'}}>{formErrors.number_of_guests}</div>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Special Requests (Optional)</label>
              <textarea className="form-control" rows={3} name="message" value={form.message} onChange={handleChange} placeholder="Any specific requirements..."></textarea>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
              <input type="checkbox" id="agreed" name="agreed" checked={form.agreed} onChange={handleChange} required />
              <label htmlFor="agreed" style={{ fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
                I agree to the House Rules, Privacy Policy, and Terms of Service.
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Booking Request'} <FiArrowRight style={{ marginLeft: 8 }} />
            </button>
          </form>
        </div>

        {/* Summary Card */}
        <div>
          <div className="checkout-summary-card">
            {type === 'room' ? (
              <>
                {imageUrl ? (
                  <img src={imageUrl} alt={itemData.name} className="summary-img" />
                ) : (
                  <div style={{ background: 'var(--color-soft)', height: 160, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)', color: 'var(--color-muted)' }}>
                    <span>No Image Available</span>
                  </div>
                )}
                <h3 className="summary-title">{itemData.name}</h3>
                <ul className="summary-details">
                  <li><span>Floor:</span> <span>{itemData.floor || 'N/A'}</span></li>
                  <li><span>Type:</span> <span>{itemData.room_type || 'N/A'}</span></li>
                  <li><span>Area:</span> <span>{itemData.area_sqft ? itemData.area_sqft + ' sq ft' : 'N/A'}</span></li>
                  <li><span>Price:</span> <span>{formatCurrency(itemData.price_per_day)} / day</span></li>
                </ul>
              </>
            ) : (
              <>
                <div style={{ background: 'var(--color-soft)', height: 160, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
                  <FiCheckCircle size={48} color="var(--color-primary)" />
                </div>
                <h3 className="summary-title">{itemData.title}</h3>
                <ul className="summary-details">
                  <li><span>Includes:</span> <span>Ground & First Floor</span></li>
                  <li><span>Total Rooms:</span> <span>5 Rooms</span></li>
                  <li><span>Guest Range:</span> <span>{itemData.guest_range}</span></li>
                  <li><span>Price:</span> <span>{formatCurrency(itemData.price)} / day</span></li>
                </ul>
              </>
            )}

            <div style={{ borderTop: '1px solid var(--color-border)', margin: 'var(--space-4) 0', paddingTop: 'var(--space-4)' }}>
              <ul className="summary-details">
                <li><span>Check-in:</span> <strong>{checkIn} at {time}</strong></li>
                <li><span>Check-out:</span> <strong>{checkOut}</strong></li>
                <li><span>Duration:</span> <strong>{days} {days === 1 ? 'Day' : 'Days'}</strong></li>
              </ul>
            </div>

            <div className="summary-total">
              <span>Estimated Total:</span>
              <span style={{ color: 'var(--color-primary)' }}>{formatCurrency(totalAmount)}</span>
            </div>

            <div className="payment-notice" style={{ marginBottom: 'var(--space-6)' }}>
              <p style={{ margin: 0 }}>Online payment will be available soon.</p>
              <p style={{ margin: 0, marginTop: 4 }}>You will pay upon confirmation or at the property.</p>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '0 0 var(--space-4) 0' }} />
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-secondary)', marginBottom: 'var(--space-3)' }}>Need Help?</div>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <a href="https://wa.me/917845671542" target="_blank" rel="noopener noreferrer" className="btn w-full" style={{ background: '#25D366', color: 'white', borderColor: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.8rem', padding: '6px' }}>
                  WhatsApp
                </a>
                <a href="tel:+917845671542" className="btn btn-outline w-full" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.8rem', padding: '6px' }}>
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <h3>Confirm Booking</h3>
            <p>Please review your booking details carefully. Do you want to submit this booking request?</p>
            <div className="custom-modal-actions">
              <button className="btn btn-outline" onClick={() => setShowConfirmModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={processBooking}>Confirm Booking</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
