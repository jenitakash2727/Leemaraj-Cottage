import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCalendar, FiAlertCircle, FiCheckCircle, FiArrowRight, FiCheck } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getRooms, getPackages, createBooking, checkAvailability } from '../services/api';
import { formatCurrency, isValidCheckInTime, isValidPhone } from '../utils/helpers';
import { LoadingSpinner, InlineError } from '../components/Common/LoadingSpinner';
import { FALLBACK_ROOMS, FALLBACK_PACKAGES } from '../utils/fallbackData';
import { useScrollReveal } from '../AnimationUtils';

export default function BookingPage() {
  useScrollReveal();
  const location = useLocation();
  const navigate = useNavigate();

  const initialState = location.state || {};
  const initialType = initialState.booking_type || 'room';

  const [bookingType, setBookingType] = useState(initialType);
  const [rooms, setRooms] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Step state
  const [currentStep, setCurrentStep] = useState(1);

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    alternate_phone: '',
    email: '',
    room: initialState.room_id || '',
    package: initialState.package_id || '',
    check_in_date: null,
    check_out_date: null,
    check_in_time: '',
    number_of_guests: '',
    message: '',
    payment_option: 'later',
    terms: false,
  });

  const [availabilityStatus, setAvailabilityStatus] = useState(null); // null, 'checking', 'available', 'unavailable'
  const [availabilityMessage, setAvailabilityMessage] = useState('');

  useEffect(() => {
    Promise.all([
      getRooms().then(res => res.data?.length ? res.data : FALLBACK_ROOMS).catch(() => FALLBACK_ROOMS),
      getPackages().then(res => res.data?.length ? res.data : FALLBACK_PACKAGES).catch(() => FALLBACK_PACKAGES)
    ])
      .then(([roomsRes, packagesRes]) => {
        setRooms(roomsRes);
        setPackages(packagesRes);
        if (initialState.package_id) {
            setForm(prev => ({ ...prev, package: initialState.package_id }));
        } else if (packagesRes.length > 0) {
            const wholeCottage = packagesRes.find(p => p.title === 'Whole Cottage Group Booking') || packagesRes[0];
            setForm(prev => ({ ...prev, package: wholeCottage.id }));
        }
      })
      .catch(() => setError('Failed to load booking options. Please try again later.'))
      .finally(() => setLoadingData(false));
  }, [initialState.package_id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setError('');
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setForm(prev => ({ ...prev, check_in_date: start, check_out_date: end }));
    setAvailabilityStatus(null);
  };

  const formatDateForApi = (date) => {
    if (!date) return '';
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  };

  const performAvailabilityCheck = async () => {
    setError('');
    if (!form.check_in_date || !form.check_out_date) {
      setError('Please select check-in and check-out dates.');
      return;
    }
    if (!isValidCheckInTime(form.check_in_time)) {
      setError('Check-in is not permitted between 10:00 PM and 5:00 AM.');
      return;
    }

    if (bookingType === 'room' && !form.room) {
      setError('Please select a room.');
      return;
    }

    if (bookingType === 'group' && (!form.number_of_guests || parseInt(form.number_of_guests) <= 35)) {
      setError('Group booking is available only for groups greater than 35 members.');
      return;
    }

    setAvailabilityStatus('checking');
    try {
      const payload = {
        booking_type: bookingType,
        check_in_date: formatDateForApi(form.check_in_date),
        check_out_date: formatDateForApi(form.check_out_date),
        room: bookingType === 'room' ? form.room : null,
        guest_count: bookingType === 'group' ? parseInt(form.number_of_guests) : null,
      };
      const res = await checkAvailability(payload);
      if (res.data.available) {
        setAvailabilityStatus('available');
        setAvailabilityMessage(res.data.message);
        setTimeout(() => setCurrentStep(5), 1000); // Auto advance after 1s
      } else {
        setAvailabilityStatus('unavailable');
        setAvailabilityMessage(res.data.message);
      }
    } catch (err) {
      setAvailabilityStatus(null);
      setError('Failed to check availability. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidPhone(form.phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    if (form.alternate_phone && !isValidPhone(form.alternate_phone)) {
      setError('Please enter a valid 10-digit alternate phone number.');
      return;
    }
    if (!form.terms) {
      setError('You must accept the Terms & Conditions.');
      return;
    }

    setSubmitting(true);
    const payload = {
      ...form,
      check_in_date: formatDateForApi(form.check_in_date),
      check_out_date: formatDateForApi(form.check_out_date),
      booking_type: bookingType,
      room: bookingType === 'room' ? form.room : null,
      package: bookingType === 'group' ? form.package : null,
    };

    try {
      const res = await createBooking(payload);
      navigate('/booking-success', { state: { reference: res.data.booking_reference, bookingDetails: payload } });
    } catch (err) {
      const apiErrors = err.response?.data;
      if (typeof apiErrors === 'object') {
        const errorMsg = Object.values(apiErrors).flat().join(' ');
        setError(errorMsg || 'Failed to submit booking. Please try again.');
      } else {
        setError('Failed to submit booking. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const StepHeader = ({ step, title }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--color-border)' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: currentStep >= step ? 'var(--color-primary)' : 'var(--color-soft)', color: currentStep >= step ? 'white' : 'var(--color-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
        {currentStep > step ? <FiCheck size={16} /> : step}
      </div>
      <h3 style={{ color: currentStep >= step ? 'var(--color-secondary)' : 'var(--color-muted)', margin: 0 }}>{title}</h3>
    </div>
  );

  return (
    <main className="page-wrapper">
      <div className="page-banner">
        <div className="container">
          <nav className="page-breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a> <span>/</span> <span>Book Now</span>
          </nav>
          <h1>Book Your Stay</h1>
          <p>Complete the steps below to request your booking</p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          {loadingData ? (
            <LoadingSpinner text="Loading booking form..." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              
              {/* STEP 1: Booking Type */}
              <div className="card card-body reveal" style={{ opacity: currentStep >= 1 ? 1 : 0.5, pointerEvents: currentStep >= 1 ? 'auto' : 'none' }}>
                <StepHeader step={1} title="Choose Booking Type" />
                {currentStep === 1 ? (
                  <>
                    <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                      <div 
                        style={{ flex: 1, padding: 'var(--space-4)', border: `2px solid ${bookingType === 'room' ? 'var(--color-primary)' : 'var(--color-border)'}`, borderRadius: 'var(--radius-lg)', cursor: 'pointer', background: bookingType === 'room' ? 'rgba(37, 99, 235, 0.05)' : 'transparent' }}
                        onClick={() => { setBookingType('room'); setForm(prev => ({...prev, package: ''})); }}
                      >
                        <h4 style={{ color: bookingType === 'room' ? 'var(--color-primary)' : 'var(--color-secondary)' }}>Room Booking</h4>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', margin: 0 }}>Book individual rooms for smaller groups.</p>
                      </div>
                      <div 
                        style={{ flex: 1, padding: 'var(--space-4)', border: `2px solid ${bookingType === 'group' ? 'var(--color-primary)' : 'var(--color-border)'}`, borderRadius: 'var(--radius-lg)', cursor: 'pointer', background: bookingType === 'group' ? 'rgba(37, 99, 235, 0.05)' : 'transparent' }}
                        onClick={() => { setBookingType('group'); setForm(prev => ({...prev, room: ''})); }}
                      >
                        <h4 style={{ color: bookingType === 'group' ? 'var(--color-primary)' : 'var(--color-secondary)' }}>Group Booking</h4>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', margin: 0 }}>Book the whole cottage. (Must be &gt;35 members)</p>
                      </div>
                    </div>
                    <div style={{ marginTop: 'var(--space-6)', textAlign: 'right' }}>
                      <button className="btn btn-primary" onClick={() => setCurrentStep(2)}>Next Step <FiArrowRight /></button>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{bookingType === 'room' ? 'Room Booking' : 'Group Booking'}</strong>
                    <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: 'var(--text-sm)' }} onClick={() => setCurrentStep(1)}>Edit</button>
                  </div>
                )}
              </div>

              {/* STEP 2: Select Stay */}
              <div className="card card-body reveal" style={{ opacity: currentStep >= 2 ? 1 : 0.5, pointerEvents: currentStep >= 2 ? 'auto' : 'none' }}>
                <StepHeader step={2} title="Select Stay Details" />
                {currentStep === 2 ? (
                  <>
                    {bookingType === 'room' ? (
                      <div className="form-group">
                        <label className="form-label">Select Room <span>*</span></label>
                        <select className="form-control" name="room" value={form.room} onChange={handleChange} required>
                          <option value="">-- Select --</option>
                          {rooms.map(r => (
                            <option key={r.id} value={r.id}>
                              {r.name} — {formatCurrency(r.price_per_day)}/day ({r.floor})
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="form-group">
                        <label className="form-label">Package Selection</label>
                        <div style={{ padding: 'var(--space-4)', background: 'var(--color-soft)', borderRadius: 'var(--radius-md)' }}>
                          <strong>Whole Cottage Group Booking</strong>
                          <p style={{ margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>Exclusive access to the full property including all rooms and common areas.</p>
                        </div>
                      </div>
                    )}

                    <div className="form-group" style={{ marginTop: 'var(--space-4)' }}>
                      <label className="form-label">Number of Guests <span>*</span></label>
                      <input className="form-control" name="number_of_guests" type="number" min={bookingType === 'group' ? "36" : "1"} value={form.number_of_guests} onChange={handleChange} placeholder={bookingType === 'group' ? "Must be greater than 35" : "e.g. 2"} required />
                      {bookingType === 'group' && (
                        <small style={{ color: 'var(--color-primary)', marginTop: 4, display: 'block' }}>Group bookings require more than 35 members.</small>
                      )}
                    </div>

                    <div style={{ marginTop: 'var(--space-6)', textAlign: 'right' }}>
                      <button className="btn btn-primary" disabled={bookingType === 'room' && !form.room} onClick={() => setCurrentStep(3)}>Next Step <FiArrowRight /></button>
                    </div>
                  </>
                ) : currentStep > 2 ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      {bookingType === 'room' ? (
                        <strong>{rooms.find(r => r.id === parseInt(form.room))?.name || 'Selected Room'}</strong>
                      ) : (
                        <strong>Whole Cottage Group Booking</strong>
                      )}
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>{form.number_of_guests} Guests</div>
                    </div>
                    <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: 'var(--text-sm)' }} onClick={() => setCurrentStep(2)}>Edit</button>
                  </div>
                ) : null}
              </div>

              {/* STEP 3 & 4: Select Dates & Check Availability */}
              <div className="card card-body reveal" style={{ opacity: currentStep >= 3 ? 1 : 0.5, pointerEvents: currentStep >= 3 ? 'auto' : 'none' }}>
                <StepHeader step={3} title="Select Dates & Availability" />
                {currentStep === 3 || currentStep === 4 ? (
                  <>
                    <div className="form-group">
                      <label className="form-label">Check-In and Check-Out Dates <span>*</span></label>
                      <DatePicker
                        selectsRange={true}
                        startDate={form.check_in_date}
                        endDate={form.check_out_date}
                        onChange={handleDateChange}
                        minDate={new Date()}
                        isClearable={true}
                        placeholderText="Select dates"
                        className="form-control w-full"
                        dateFormat="MMM d, yyyy"
                        wrapperClassName="w-full"
                      />
                    </div>

                    <div className="form-group" style={{ marginTop: 'var(--space-4)' }}>
                      <label className="form-label">Estimated Arrival Time <span>*</span></label>
                      <input className="form-control" name="check_in_time" type="time" value={form.check_in_time} onChange={handleChange} required />
                      <small style={{ color: 'var(--color-muted)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <FiAlertCircle size={12} /> Check-in is not permitted between 10:00 PM and 5:00 AM
                      </small>
                    </div>

                    {error && currentStep <= 4 && <InlineError message={error} />}

                    <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-4)', background: 'var(--color-soft)', borderRadius: 'var(--radius-lg)' }}>
                      <button 
                        className="btn btn-primary w-full" 
                        onClick={performAvailabilityCheck}
                        disabled={availabilityStatus === 'checking' || !form.check_in_date || !form.check_out_date || !form.check_in_time}
                      >
                        {availabilityStatus === 'checking' ? 'Checking...' : 'Check Availability'}
                      </button>
                      
                      {availabilityStatus === 'available' && (
                        <div style={{ marginTop: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 8, color: '#15803d', fontWeight: 600 }}>
                          <FiCheckCircle size={20} /> {availabilityMessage}
                        </div>
                      )}
                      
                      {availabilityStatus === 'unavailable' && (
                        <div style={{ marginTop: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 8, color: '#b91c1c', fontWeight: 600 }}>
                          <FiAlertCircle size={20} /> {availabilityMessage}
                        </div>
                      )}
                    </div>
                  </>
                ) : currentStep > 4 ? (
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{formatDateForApi(form.check_in_date)} to {formatDateForApi(form.check_out_date)}</strong>
                      <div style={{ fontSize: 'var(--text-sm)', color: '#15803d', fontWeight: 600 }}>Available</div>
                    </div>
                    <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: 'var(--text-sm)' }} onClick={() => setCurrentStep(3)}>Edit</button>
                  </div>
                ) : null}
              </div>

              {/* STEP 5: Guest Details & Submit */}
              <div className="card card-body reveal" style={{ opacity: currentStep >= 5 ? 1 : 0.5, pointerEvents: currentStep >= 5 ? 'auto' : 'none' }}>
                <StepHeader step={5} title="Guest Details & Confirmation" />
                {currentStep === 5 && (
                  <form onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Full Name <span>*</span></label>
                        <input className="form-control" name="full_name" value={form.full_name} onChange={handleChange} placeholder="Your full name" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone Number <span>*</span></label>
                        <input className="form-control" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="10-digit mobile number" required />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Alternate Phone</label>
                        <input className="form-control" name="alternate_phone" type="tel" value={form.alternate_phone} onChange={handleChange} placeholder="Optional" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input className="form-control" name="email" type="email" value={form.email} onChange={handleChange} placeholder="Optional" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Message / Special Requests</label>
                      <textarea className="form-control" name="message" rows={3} value={form.message} onChange={handleChange} placeholder="Any special requests or details about your group..." />
                    </div>

                    <div style={{ padding: 'var(--space-4)', background: 'var(--color-soft)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)' }}>
                      <p style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>
                        <strong>Note:</strong> For any queries or details about how many members can stay, please contact us.
                      </p>
                      <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>
                        Your booking request will be confirmed by the owner. No payment is required right now.
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', marginBottom: 'var(--space-6)', padding: 'var(--space-4)', background: 'var(--color-soft)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                      <input type="checkbox" id="terms" name="terms" checked={form.terms} onChange={handleChange} style={{ marginTop: 3, accentColor: 'var(--color-primary)' }} required />
                      <label htmlFor="terms" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', cursor: 'pointer', lineHeight: 1.6 }}>
                        I accept the <strong>Terms &amp; Conditions</strong> — No smoking, no alcohol, no non-vegetarian food,
                        no pets, unmarried couples not allowed, and the check-in policy (not permitted between 10 PM – 5 AM).
                      </label>
                    </div>

                    {error && <InlineError message={error} />}

                    <button type="submit" className="btn btn-primary btn-lg w-full" disabled={submitting}>
                      {submitting ? 'Submitting...' : 'Submit Booking Request'}
                    </button>
                  </form>
                )}
              </div>

            </div>
          )}
        </div>
      </section>
    </main>
  );
}
