import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiCheck, FiInfo, FiGrid, FiMaximize, FiLayers, FiAlertCircle } from 'react-icons/fi';
import { getRooms, checkAvailability } from '../services/api';
import { getImageUrl, formatCurrency } from '../utils/helpers';
import { LoadingSpinner, InlineError } from '../components/Common/LoadingSpinner';
import { SkeletonRoomDetails } from '../components/Common/SkeletonLoaders';
import ImageWithFallback from '../components/Common/ImageWithFallback';
import { FALLBACK_ROOMS } from '../utils/fallbackData';
import ListingImageGallery from '../components/Common/ListingImageGallery';
import { toast } from 'react-toastify';
import './RoomDetailsPage.css';

export default function RoomDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking State
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [checkInTime, setCheckInTime] = useState('');
  const [availStatus, setAvailStatus] = useState(null); // 'checking', 'available', 'unavailable'
  const [availMessage, setAvailMessage] = useState('');

  useEffect(() => {
    getRooms()
      .then(res => {
        const roomsData = res.data?.length ? res.data : FALLBACK_ROOMS;
        const found = roomsData.find(r => r.id === parseInt(id));
        if (found) setRoom(found);
        else setError('Room not found.');
      })
      .catch(err => {
        const found = FALLBACK_ROOMS.find(r => r.id === parseInt(id));
        if (found) setRoom(found);
        else setError('Room not found.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const validateForm = () => {
    if (!startDate || !endDate) {
      toast.error("Please select check-in and check-out dates.");
      return false;
    }
    if (endDate <= startDate) {
      toast.error("Check-out date must be after check-in date.");
      return false;
    }
    
    if (checkInTime) {
      const [hoursStr, minutesStr] = checkInTime.split(':');
      const hours = parseInt(hoursStr, 10);
      if (hours >= 22 || hours < 5) {
        toast.error("Check-in is not permitted between 10:00 PM and 5:00 AM.");
        return false;
      }
    }
    return true;
  };

  const handleCheckAvailability = async () => {
    if (!validateForm()) return;

    setAvailStatus('checking');
    try {
      const res = await checkAvailability({
        booking_type: 'room',
        room: room.id,
        check_in_date: startDate.toISOString().split('T')[0],
        check_out_date: endDate.toISOString().split('T')[0],
      });
      if (res.data.available) {
        setAvailStatus('available');
        setAvailMessage('Dates are available!');
      } else {
        setAvailStatus('unavailable');
        setAvailMessage(res.data.message || 'Room is unavailable for these dates.');
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
    
    navigate(`/checkout?type=room&roomId=${room.id}&checkIn=${startDate.toISOString().split('T')[0]}&checkOut=${endDate.toISOString().split('T')[0]}&time=${checkInTime}`);
  };

  if (loading) return <main className="page-wrapper"><div className="container" style={{paddingTop: 100}}><SkeletonRoomDetails /></div></main>;
  if (error || !room) return <main className="page-wrapper"><div className="container" style={{paddingTop: 100}}><InlineError message={error || "Room not found."} /></div></main>;

  const mainImage = room.main_image_url || (room.images && room.images.length > 0 ? room.images[0].image_url : getImageUrl(room.image_url));
  const sideImages = room.images && room.images.length > 1 ? room.images.slice(1, 3) : [];

  return (
    <main className="room-details-page">
      <Helmet>
        <title>{room.name} | Leema Raj Cottage Stay</title>
      </Helmet>

      {/* Hero / Header */}
      <div className="compact-page-header">
        <div className="container">
          <h1>{room.name}</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', color: 'var(--color-muted)', marginTop: 'var(--space-2)' }}>
            {room.floor && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FiLayers /> {room.floor}</span>}
            {room.area_sqft && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FiMaximize /> {room.area_sqft} sq ft</span>}
            {room.room_type && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FiInfo /> {room.room_type}</span>}
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: 'var(--space-8)' }}>
        {mainImage ? (
          <ListingImageGallery 
            images={room.images || []} 
            title={room.name} 
            mainImage={mainImage} 
          />
        ) : (
          <div style={{ height: '400px', background: 'var(--color-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-xl)' }}>
            <span style={{ color: 'var(--color-muted)', fontSize: '1.2rem' }}>No Image Available</span>
          </div>
        )}
      </div>

      {/* Content Wrapper */}
      <div className="room-content-wrapper">
        <div className="room-main-info">
          <h2>About this room</h2>
          <p style={{ color: 'var(--color-muted)', lineHeight: 1.8, marginBottom: 'var(--space-8)', fontSize: 'var(--text-lg)' }}>
            {room.description || "A beautifully appointed room with modern amenities, perfectly suited for a relaxing stay. Fully air-conditioned and well-maintained."}
          </p>

          <div style={{ background: 'var(--color-accent)', color: '#000', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-10)', fontWeight: 600 }}>
            <FiInfo size={24} />
            For any queries regarding accommodation, stay arrangements, group bookings, room details, or the number of guests, please contact us.
          </div>

          <h2>Room Highlights</h2>
          <div className="amenities-grid">
            <div className="amenity-item"><FiCheck style={{ color: 'var(--color-primary)' }} /> Fully Air-Conditioned</div>
            <div className="amenity-item"><FiCheck style={{ color: 'var(--color-primary)' }} /> 65" Smart TV</div>
            <div className="amenity-item"><FiCheck style={{ color: 'var(--color-primary)' }} /> Pure RO Drinking Water</div>
            <div className="amenity-item"><FiCheck style={{ color: 'var(--color-primary)' }} /> High-Speed Wi-Fi</div>
            <div className="amenity-item"><FiCheck style={{ color: 'var(--color-primary)' }} /> 24/7 Hot Water</div>
            <div className="amenity-item"><FiCheck style={{ color: 'var(--color-primary)' }} /> Premium Teakwood Beds</div>
          </div>

          <h2>House Rules</h2>
          <div className="house-rules">
            <div className="rule-item"><FiAlertCircle size={18} /> <span>No smoking inside the property.</span></div>
            <div className="rule-item"><FiAlertCircle size={18} /> <span>No alcohol or liquor allowed.</span></div>
            <div className="rule-item"><FiAlertCircle size={18} /> <span>No pets allowed.</span></div>
            <div className="rule-item"><FiAlertCircle size={18} /> <span>No unmarried couples allowed.</span></div>
            <div className="rule-item"><FiAlertCircle size={18} /> <span>No non-veg cooking or consumption inside the property.</span></div>
          </div>
        </div>

        {/* Sticky Booking Sidebar */}
        <div>
          <div className="sticky-booking-card">
            <div className="sticky-price">
              {formatCurrency(room.price_per_day)} <span>/ day</span>
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
                <input type="time" className="form-control" value={checkInTime} onChange={e => setCheckInTime(e.target.value)} />
                <div style={{ fontSize: '11px', color: 'var(--color-muted)', marginTop: 4 }}>Check-in is not permitted between 10:00 PM and 5:00 AM</div>
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
              Book Now
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
