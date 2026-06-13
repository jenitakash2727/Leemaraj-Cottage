import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiCheck, FiInfo, FiUsers, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { getPackages, checkAvailability } from '../services/api';
import { formatCurrency } from '../utils/helpers';
import { LoadingSpinner, InlineError } from '../components/Common/LoadingSpinner';
import { SkeletonRoomDetails } from '../components/Common/SkeletonLoaders';
import { FALLBACK_PACKAGES } from '../utils/fallbackData';
import { toast } from 'react-toastify';
import ListingImageGallery from '../components/Common/ListingImageGallery';
import './GroupDetailsPage.css';

export default function GroupDetailsPage() {
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking State
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [availStatus, setAvailStatus] = useState(null);
  const [availMessage, setAvailMessage] = useState('');

  useEffect(() => {
    getPackages()
      .then(res => {
        const pkgs = res.data?.length ? res.data : FALLBACK_PACKAGES;
        const wholeCottage = pkgs.find(p => p.title === 'Whole Cottage Group Booking') || pkgs[0];
        setPackageData(wholeCottage);
      })
      .catch(err => {
        const wholeCottage = FALLBACK_PACKAGES.find(p => p.title === 'Whole Cottage Group Booking') || FALLBACK_PACKAGES[0];
        setPackageData(wholeCottage);
      })
      .finally(() => setLoading(false));
  }, []);

  const validateForm = () => {
    if (!startDate || !endDate) {
      toast.error("Please select check-in and check-out dates.");
      return false;
    }
    if (endDate <= startDate) {
      toast.error("Check-out date must be after check-in date.");
      return false;
    }
    if (!guestCount || parseInt(guestCount) <= (packageData?.min_guest_count || 35)) {
      toast.error(`Group booking is available only for groups greater than ${packageData?.min_guest_count || 35} members.`);
      return false;
    }
    
    if (checkInTime) {
      const [hoursStr] = checkInTime.split(':');
      const hours = parseInt(hoursStr, 10);
      if (hours >= 22 || hours < 5) {
        toast.error("Check-in is not permitted between 10:00 PM and 5:00 AM.");
        return false;
      }
    } else {
      toast.error("Please select check-in time.");
      return false;
    }

    if (!checkOutTime) {
      toast.error("Please select check-out time.");
      return false;
    }

    return true;
  };

  const handleCheckAvailability = async () => {
    if (!validateForm()) return;
    setAvailStatus('checking');
    try {
      const res = await checkAvailability({
        booking_type: 'group',
        guest_count: guestCount,
        check_in_date: startDate.toISOString().split('T')[0],
        check_out_date: endDate.toISOString().split('T')[0],
      });
      if (res.data.available) {
        setAvailStatus('available');
        setAvailMessage('Dates are available!');
      } else {
        setAvailStatus('unavailable');
        setAvailMessage(res.data.message || 'Whole cottage is unavailable for these dates.');
      }
    } catch (err) {
      setAvailStatus('unavailable');
      setAvailMessage('Failed to check availability. Please try again.');
    }
  };

  const handleBookNow = () => {
    if (!validateForm()) return;
    if (availStatus !== 'available') {
        toast.error("Please check availability first.");
        return;
    }
    
    navigate(`/checkout?type=group&packageId=${packageData.id}&checkIn=${startDate.toISOString().split('T')[0]}&checkOut=${endDate.toISOString().split('T')[0]}&time=${checkInTime}&guests=${guestCount}&outTime=${checkOutTime}`);
  };

  if (loading) return <main className="page-wrapper"><div className="container" style={{paddingTop: 100}}><SkeletonRoomDetails /></div></main>;
  if (error || !packageData) return <main className="page-wrapper"><div className="container" style={{paddingTop: 100}}><InlineError message={error || "Group booking not found."} /></div></main>;

  return (
    <main className="group-details-page">
      <Helmet>
        <title>Whole Cottage Group Booking | Leema Raj Cottage Stay</title>
      </Helmet>

      {/* Hero / Header */}
      <div className="compact-page-header">
        <div className="container">
          <h1>Whole Cottage Group Booking</h1>
          <div style={{ display: 'flex', gap: 'var(--space-4)', color: 'var(--color-muted)', marginTop: 'var(--space-2)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FiUsers /> For groups greater than 35 members</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FiClock /> 24 Hours Stay</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: 'var(--space-8)' }}>
        {packageData?.main_image_url || (packageData?.images && packageData?.images.length > 0) ? (
          <ListingImageGallery 
            images={packageData.images || []} 
            title="Whole Cottage Group Booking" 
            mainImage={packageData.main_image_url || packageData.images[0]?.image_url} 
          />
        ) : (
          <div style={{ height: '400px', background: 'var(--color-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-xl)' }}>
            <span style={{ color: 'var(--color-muted)', fontSize: '1.2rem' }}>No Image Available</span>
          </div>
        )}
      </div>

      <div className="group-content-wrapper">
        <div className="group-main-info">
          <h2>About the Whole Cottage</h2>
          <p style={{ color: 'var(--color-muted)', lineHeight: 1.8, marginBottom: 'var(--space-8)', fontSize: 'var(--text-lg)' }}>
            Enjoy exclusive access to our entire cottage, perfectly designed to host large family gatherings, 
            wedding guests, and corporate outings. With multiple bedrooms and spacious common areas, your group 
            will have all the space needed for a comfortable and memorable stay.
          </p>

          <div style={{ background: 'var(--color-accent)', color: '#000', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-10)', fontWeight: 600 }}>
            <FiInfo size={24} />
            For any queries regarding accommodation, stay arrangements, group bookings, room details, or the number of guests, please contact us.
          </div>

          <h2>Space Information</h2>
          <div className="space-card">
            <h3><FiCheckCircle color="var(--color-primary)" /> Included Areas</h3>
            <ul>
              <li><FiCheck /> Total Rooms: 5 (across two floors)</li>
              <li><FiCheck /> Ground Floor Area: 850 sq ft</li>
              <li><FiCheck /> First Floor Area: 1100 sq ft</li>
              <li><FiCheck /> Ground Floor Common Room: 80 sq ft</li>
              <li><FiCheck /> First Floor Common Room: 80 sq ft</li>
            </ul>
          </div>

          <div className="space-card">
            <h3><FiCheckCircle color="var(--color-primary)" /> Room Configuration</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
              <div>
                <h4 style={{ color: 'var(--color-secondary)', marginBottom: 'var(--space-2)' }}>First Floor</h4>
                <ul>
                  <li>Single Bedroom 1</li>
                  <li>Double Bedroom 1</li>
                  <li>Triple Bedroom 1</li>
                </ul>
              </div>
              <div>
                <h4 style={{ color: 'var(--color-secondary)', marginBottom: 'var(--space-2)' }}>Ground Floor</h4>
                <ul>
                  <li>Single Bedroom 2</li>
                  <li>Triple Bedroom 2</li>
                </ul>
              </div>
            </div>
          </div>

          <h2>Perfect For</h2>
          <div className="perfect-for-grid">
            <div className="perfect-for-item">Wedding guests</div>
            <div className="perfect-for-item">Family functions</div>
            <div className="perfect-for-item">Temple visits</div>
            <div className="perfect-for-item">Group outings</div>
            <div className="perfect-for-item">Picnics</div>
            <div className="perfect-for-item">Events</div>
          </div>

          <h2>House Rules</h2>
          <div className="house-rules">
            <div className="rule-item"><FiAlertCircle size={18} /> <span>No smoking inside the property.</span></div>
            <div className="rule-item"><FiAlertCircle size={18} /> <span>No alcohol or liquor allowed.</span></div>
            <div className="rule-item"><FiAlertCircle size={18} /> <span>No pets allowed.</span></div>
            <div className="rule-item"><FiAlertCircle size={18} /> <span>No non-veg cooking or consumption inside the property.</span></div>
          </div>
        </div>

        {/* Sticky Booking Sidebar */}
        <div>
          <div className="sticky-booking-card">
            <div className="sticky-price">
              {formatCurrency(packageData.price)} <span>/ day</span>
            </div>

            <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                <label className="form-label" style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Guest Count <span style={{color:'red'}}>*</span></label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder={`Must be > ${packageData?.min_guest_count || 35}`} 
                  value={guestCount} 
                  onChange={e => {
                      setGuestCount(e.target.value);
                      setAvailStatus(null);
                      setAvailMessage('');
                  }} 
                />
            </div>

            <div className="date-picker-wrapper">
              <label>Select Dates <span style={{color:'red'}}>*</span></label>
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  setDateRange(update);
                  setAvailStatus(null);
                  setAvailMessage('');
                }}
                minDate={new Date()}
                placeholderText="Check-in - Check-out"
                className="form-control"
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
                <label className="form-label" style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Check-in Time <span style={{color:'red'}}>*</span></label>
                <input type="time" className="form-control" value={checkInTime} onChange={e => setCheckInTime(e.target.value)} required />
                <div style={{ fontSize: '11px', color: 'var(--color-muted)', marginTop: 4 }}>Check-in is not permitted between 10:00 PM and 5:00 AM</div>
            </div>

            <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
                <label className="form-label" style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Check-out Time <span style={{color:'red'}}>*</span></label>
                <input type="time" className="form-control" value={checkOutTime} onChange={e => setCheckOutTime(e.target.value)} required />
            </div>

            <button 
              className={`btn w-full ${availStatus === 'available' ? 'btn-outline' : 'btn-primary'}`} 
              onClick={handleCheckAvailability}
              style={{ marginBottom: 'var(--space-4)', borderColor: availStatus === 'available' ? '#10B981' : undefined, color: availStatus === 'available' ? '#10B981' : undefined }}
              disabled={availStatus === 'checking'}
            >
              {availStatus === 'checking' ? 'Checking...' : (availStatus === 'available' ? 'Available - Check Again' : 'Check Availability')}
            </button>

            {availMessage && (
              <div style={{
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                marginBottom: 'var(--space-4)',
                background: availStatus === 'available' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                color: availStatus === 'available' ? '#10B981' : '#DC2626',
                display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500
              }}>
                {availStatus === 'available' ? <FiCheck /> : <FiAlertCircle />} {availMessage}
              </div>
            )}

            <button 
              className="btn btn-primary w-full" 
              onClick={handleBookNow}
              disabled={availStatus !== 'available'}
            >
              Book Whole Cottage
            </button>
            <div style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginTop: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              You won't be charged yet
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '0 0 var(--space-4) 0' }} />
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-secondary)', marginBottom: 'var(--space-3)' }}>Need Help?</div>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <a href="https://wa.me/917845671542" target="_blank" rel="noopener noreferrer" className="btn w-full" style={{ background: '#25D366', color: 'white', borderColor: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  WhatsApp
                </a>
                <a href="tel:+917845671542" className="btn btn-outline w-full" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
