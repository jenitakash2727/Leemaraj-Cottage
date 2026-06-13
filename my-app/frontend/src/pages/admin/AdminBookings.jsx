import React, { useEffect, useState, useCallback } from 'react';
import { FiEdit2, FiTrash2, FiEye, FiX, FiDownload, FiPhone, FiMessageCircle, FiCopy, FiAlertCircle } from 'react-icons/fi';
import { MdWhatsapp } from 'react-icons/md';
import { getAdminBookings, updateAdminBooking, deleteAdminBooking } from '../../services/api';
import { LoadingSpinner, InlineError } from '../../components/Common/LoadingSpinner';
import { SkeletonTable } from '../../components/Common/SkeletonLoaders';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../components/Common/ConfirmationModal';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter state
  const [filterStatus, setFilterStatus] = useState('');

  // Modal states
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ status: '', admin_notes: '' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const checkConflict = (booking, allBookings) => {
    if (booking.status !== 'pending' && booking.status !== 'confirmed') return false;
    return allBookings.some(other => {
      if (other.id === booking.id) return false;
      if (other.status !== 'pending' && other.status !== 'confirmed') return false;
      
      const startA = new Date(booking.check_in_date);
      const endA = new Date(booking.check_out_date);
      const startB = new Date(other.check_in_date);
      const endB = new Date(other.check_out_date);
      
      if (startB < endA && endB > startA) {
        if (booking.booking_type === 'group' || other.booking_type === 'group') return true;
        if (booking.room && other.room && booking.room === other.room) return true;
      }
      return false;
    });
  };

  const fetchBookings = useCallback(() => {
    setLoading(true);
    const params = filterStatus ? { status: filterStatus } : {};
    getAdminBookings(params)
      .then(res => setBookings(res.data))
      .catch(() => setError('Failed to load bookings.'))
      .finally(() => setLoading(false));
  }, [filterStatus]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleSaveEdit = async () => {
    try {
      await updateAdminBooking(selectedBooking.id, editForm);
      setIsEditModalOpen(false);
      toast.success("Booking updated successfully!");
      fetchBookings();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error('Failed to update booking status.');
      }
    }
  };

  const executeDelete = async (id) => {
    try {
      await deleteAdminBooking(id);
      fetchBookings();
      toast.success("Booking deleted successfully!");
    } catch (err) {
      toast.error('Failed to delete booking.');
    }
  };

  const handleDeleteClick = (id) => {
    setConfirmModal({ isOpen: true, id });
  };

  const exportToCSV = () => {
    if (bookings.length === 0) return;
    
    const headers = ["Reference", "Name", "Phone", "Check-in", "Check-out", "Type", "Status", "Total Amount"];
    const rows = bookings.map(b => [
      b.booking_reference,
      b.full_name,
      b.phone,
      b.check_in_date,
      b.check_out_date,
      b.booking_type,
      b.status,
      b.total_estimated_amount || 0
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bookings_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.info('Booking Reference copied to clipboard!');
  };

  if (loading && bookings.length === 0) return <div style={{marginTop: 'var(--space-6)'}}><SkeletonTable columns={6} rows={5} /></div>;

  return (
    <div>
      <div className="admin-page-header">
        <h1 style={{ margin: 0 }}>Bookings</h1>
        
        {/* Controls */}
        <div className="admin-header-actions">
          <select 
            className="form-control" 
            style={{ width: 'auto', minWidth: 200 }}
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="btn btn-outline" onClick={exportToCSV} style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
            <FiDownload size={16} /> Export CSV
          </button>
        </div>
      </div>

      {error && <InlineError message={error} />}

      <div className="admin-table-scroll desktop-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ref</th>
              <th>Guest Info</th>
              <th>Stay Dates</th>
              <th>Type / Room</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>No bookings found.</td>
              </tr>
            ) : (
              bookings.map(b => (
                <tr key={b.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{b.booking_reference}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.full_name}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>{b.phone}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 'var(--text-sm)' }}>{formatDate(b.check_in_date)} to {formatDate(b.check_out_date)}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>Check-in: {b.check_in_time}</div>
                  </td>
                  <td>
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ 
                        display: 'inline-block',
                        padding: '2px 8px', 
                        borderRadius: '4px', 
                        fontSize: '10px', 
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        color: '#fff',
                        background: b.booking_type === 'room' ? '#3B82F6' : '#8B5CF6'
                      }}>
                        {b.booking_type}
                      </span>
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                      {b.room ? b.room_details?.name : (b.package_details?.title || 'Whole Cottage Group Booking')}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                      <span className={`status-badge status-badge--${b.status}`}>
                        {b.status}
                      </span>
                      {checkConflict(b, bookings) && (
                        <span style={{ 
                          fontSize: '10px', 
                          fontWeight: 600, 
                          color: '#DC2626', 
                          background: '#FEE2E2', 
                          padding: '2px 6px', 
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}>
                          <FiAlertCircle size={10} /> Conflict detected
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button className="btn-icon" title="View Details" onClick={() => { setSelectedBooking(b); setIsViewModalOpen(true); }}>
                        <FiEye size={14} />
                      </button>
                      <button className="btn-icon" title="Edit Status" onClick={() => { setSelectedBooking(b); setEditForm({ status: b.status, admin_notes: b.admin_notes || '' }); setIsEditModalOpen(true); }}>
                        <FiEdit2 size={14} />
                      </button>
                      <button className="btn-icon btn-icon--danger" title="Delete" onClick={() => handleDeleteClick(b.id)}>
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mobile-records-list">
        {bookings.length === 0 ? (
          <div className="mobile-record-card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            No bookings found.
          </div>
        ) : (
          bookings.map(b => (
            <div key={b.id} className="mobile-record-card">
              <div className="mobile-record-row">
                <div className="mobile-record-label">Ref</div>
                <div className="mobile-record-value" style={{ fontFamily: 'monospace', fontWeight: 600 }}>{b.booking_reference}</div>
              </div>
              <div className="mobile-record-row">
                <div className="mobile-record-label">Guest Info</div>
                <div className="mobile-record-value">
                  <div style={{ fontWeight: 600 }}>{b.full_name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-muted)' }}>{b.phone}</div>
                </div>
              </div>
              <div className="mobile-record-row">
                <div className="mobile-record-label">Stay Dates</div>
                <div className="mobile-record-value">
                  <div style={{ fontSize: '13px' }}>{formatDate(b.check_in_date)} to {formatDate(b.check_out_date)}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Check-in: {b.check_in_time}</div>
                </div>
              </div>
              <div className="mobile-record-row">
                <div className="mobile-record-label">Type / Room</div>
                <div className="mobile-record-value">
                  <div style={{ display: 'inline-block', padding: '2px 6px', background: b.booking_type === 'group' ? '#A78BFA' : '#60A5FA', color: '#FFF', borderRadius: 4, fontSize: 10, fontWeight: 'bold', marginBottom: 4 }}>
                    {b.booking_type.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{b.booking_type === 'room' ? b.room_details?.name : (b.package_details?.title || 'Whole Cottage Group Booking')}</div>
                </div>
              </div>
              <div className="mobile-record-row">
                <div className="mobile-record-label">Status</div>
                <div className="mobile-record-value">
                  <span className={`status-badge status-badge--${b.status}`}>{b.status}</span>
                </div>
              </div>
              <div className="mobile-record-row">
                <div className="mobile-record-label">Actions</div>
                <div className="mobile-record-value">
                  <div className="admin-actions">
                    <button className="btn-icon" title="View Details" onClick={() => { setSelectedBooking(b); setIsViewModalOpen(true); }}>
                      <FiEye size={14} />
                    </button>
                    <button className="btn-icon" title="Edit" onClick={() => { setSelectedBooking(b); setEditForm({ status: b.status, admin_notes: b.admin_notes || '' }); setIsEditModalOpen(true); }}>
                      <FiEdit2 size={14} />
                    </button>
                    <button className="btn-icon btn-icon--danger" title="Delete" onClick={() => handleDeleteClick(b.id)}>
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── View Modal ── */}
      {isViewModalOpen && selectedBooking && (
        <div className="admin-modal-overlay" onClick={() => setIsViewModalOpen(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 style={{ margin: 0 }}>Booking Details</h3>
              <button className="btn-icon" style={{ border: 'none' }} onClick={() => setIsViewModalOpen(false)}>
                <FiX size={20} />
              </button>
            </div>
            <div className="admin-modal__body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <strong>Ref:</strong> {selectedBooking.booking_reference}
                  <button className="btn-icon" style={{ width: 24, height: 24 }} onClick={() => handleCopy(selectedBooking.booking_reference)} title="Copy Ref"><FiCopy size={12} /></button>
                </div>
                <div><strong>Status:</strong> <span className={`status-badge status-badge--${selectedBooking.status}`}>{selectedBooking.status}</span></div>
                <div><strong>Name:</strong> {selectedBooking.full_name}</div>
                <div>
                  <strong>Phone:</strong> {selectedBooking.phone}
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <a href={`tel:${selectedBooking.phone}`} className="btn btn-outline btn-sm" style={{ padding: '2px 8px', fontSize: 11 }}><FiPhone size={10} style={{ marginRight: 4 }} /> Call</a>
                    <a href={`https://wa.me/91${selectedBooking.phone}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ padding: '2px 8px', fontSize: 11, color: '#25D366', borderColor: '#25D366' }}><MdWhatsapp size={12} style={{ marginRight: 4 }} /> WhatsApp</a>
                  </div>
                </div>
                <div><strong>Email:</strong> {selectedBooking.email || '—'}</div>
                <div><strong>Guests:</strong> {selectedBooking.number_of_guests}</div>
                <div><strong>Check In:</strong> {formatDate(selectedBooking.check_in_date)} ({selectedBooking.check_in_time})</div>
                <div><strong>Check Out:</strong> {formatDate(selectedBooking.check_out_date)}</div>
                <div><strong>Type:</strong> {selectedBooking.booking_type}</div>
                <div><strong>Payment:</strong> {selectedBooking.payment_option}</div>
              </div>
              <div style={{ marginTop: 'var(--space-4)' }}>
                <strong>Special Request:</strong>
                <p style={{ background: 'var(--color-bg)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', marginTop: 4 }}>
                  {selectedBooking.message || 'No special requests.'}
                </p>
              </div>
              <div>
                <strong>Admin Notes:</strong>
                <p style={{ background: '#FFFBEB', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', marginTop: 4, border: '1px solid #FEF3C7' }}>
                  {selectedBooking.admin_notes || 'No notes.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {isEditModalOpen && selectedBooking && (
        <div className="admin-modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 style={{ margin: 0 }}>Update Booking</h3>
              <button className="btn-icon" style={{ border: 'none' }} onClick={() => setIsEditModalOpen(false)}>
                <FiX size={20} />
              </button>
            </div>
            <div className="admin-modal__body">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-control" value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})}>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Admin Notes (internal only)</label>
                <textarea className="form-control" rows={4} value={editForm.admin_notes} onChange={e => setEditForm({...editForm, admin_notes: e.target.value})} />
              </div>
            </div>
            <div className="admin-modal__footer">
              <button className="btn btn-outline" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title="Delete Booking"
        message="Are you sure you want to delete this booking? This cannot be undone."
        onConfirm={() => executeDelete(confirmModal.id)}
        onCancel={() => setConfirmModal({ isOpen: false, id: null })}
      />
    </div>
  );
}
