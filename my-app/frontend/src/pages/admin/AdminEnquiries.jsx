import React, { useEffect, useState, useCallback } from 'react';
import { FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { getAdminEnquiries, updateAdminEnquiry, deleteAdminEnquiry } from '../../services/api';
import { LoadingSpinner, InlineError } from '../../components/Common/LoadingSpinner';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../components/Common/ConfirmationModal';

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [filterResolved, setFilterResolved] = useState('');
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });

  const fetchEnquiries = useCallback(() => {
    setLoading(true);
    const params = filterResolved !== '' ? { is_resolved: filterResolved } : {};
    getAdminEnquiries(params)
      .then(res => setEnquiries(res.data))
      .catch(() => setError('Failed to load enquiries.'))
      .finally(() => setLoading(false));
  }, [filterResolved]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const handleToggleResolve = async (id, currentStatus) => {
    try {
      await updateAdminEnquiry(id, { is_resolved: !currentStatus });
      fetchEnquiries();
      toast.success(`Enquiry marked as ${!currentStatus ? 'resolved' : 'unresolved'}.`);
    } catch (err) {
      toast.error('Failed to update enquiry status.');
    }
  };

  const executeDelete = async (id) => {
    try {
      await deleteAdminEnquiry(id);
      fetchEnquiries();
      toast.success("Enquiry deleted successfully!");
    } catch (err) {
      toast.error('Failed to delete enquiry.');
    }
  };

  const handleDeleteClick = (id) => {
    setConfirmModal({ isOpen: true, id });
  };

  if (loading && enquiries.length === 0) return <LoadingSpinner />;

  return (
    <div>
      <div className="admin-page-header">
        <h1 style={{ margin: 0 }}>Contact Enquiries</h1>
        
        <div className="admin-header-actions">
          <select 
            className="form-control" 
            style={{ width: 'auto', minWidth: 200 }}
            value={filterResolved}
            onChange={e => setFilterResolved(e.target.value)}
          >
            <option value="">All Enquiries</option>
            <option value="false">Unresolved</option>
            <option value="true">Resolved</option>
          </select>
        </div>
      </div>

      {error && <InlineError message={error} />}

      <div className="admin-table-scroll desktop-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Contact Info</th>
              <th>Message</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>No enquiries found.</td></tr>
            ) : (
              enquiries.map(eq => (
                <tr key={eq.id} style={{ opacity: eq.is_resolved ? 0.7 : 1 }}>
                  <td style={{ fontSize: 'var(--text-sm)', whiteSpace: 'nowrap' }}>
                    {new Date(eq.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{eq.name}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>{eq.phone}</div>
                    {eq.email && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>{eq.email}</div>}
                  </td>
                  <td style={{ maxWidth: 300 }}>
                    <p style={{ margin: 0, fontSize: 'var(--text-sm)', whiteSpace: 'pre-wrap' }}>{eq.message}</p>
                  </td>
                  <td>
                    <span className={`status-badge ${eq.is_resolved ? 'status-badge--resolved' : 'status-badge--unresolved'}`}>
                      {eq.is_resolved ? 'Resolved' : 'Unresolved'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button 
                        className="btn-icon" 
                        title={eq.is_resolved ? "Mark Unresolved" : "Mark Resolved"}
                        onClick={() => handleToggleResolve(eq.id, eq.is_resolved)}
                        style={{ color: eq.is_resolved ? 'var(--color-muted)' : '#065F46', borderColor: eq.is_resolved ? 'var(--color-border)' : '#065F46' }}
                      >
                        {eq.is_resolved ? <FiX size={14} /> : <FiCheck size={14} />}
                      </button>
                      <button className="btn-icon btn-icon--danger" title="Delete" onClick={() => handleDeleteClick(eq.id)}>
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
        {enquiries.length === 0 ? (
          <div className="mobile-record-card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            No enquiries found.
          </div>
        ) : (
          enquiries.map(eq => (
            <div key={eq.id} className="mobile-record-card" style={{ opacity: eq.is_resolved ? 0.7 : 1 }}>
              <div className="mobile-record-row">
                <div className="mobile-record-label">Date</div>
                <div className="mobile-record-value">{new Date(eq.created_at).toLocaleDateString()}</div>
              </div>
              <div className="mobile-record-row">
                <div className="mobile-record-label">Contact Info</div>
                <div className="mobile-record-value">
                  <div style={{ fontWeight: 600 }}>{eq.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-muted)' }}>{eq.phone}</div>
                  {eq.email && <div style={{ fontSize: '13px', color: 'var(--color-muted)' }}>{eq.email}</div>}
                </div>
              </div>
              <div className="mobile-record-row">
                <div className="mobile-record-label">Message</div>
                <div className="mobile-record-value">
                  <p style={{ margin: 0, fontSize: '14px', whiteSpace: 'pre-wrap' }}>{eq.message}</p>
                </div>
              </div>
              <div className="mobile-record-row">
                <div className="mobile-record-label">Status</div>
                <div className="mobile-record-value">
                  <span className={`status-badge ${eq.is_resolved ? 'status-badge--resolved' : 'status-badge--unresolved'}`}>
                    {eq.is_resolved ? 'Resolved' : 'Unresolved'}
                  </span>
                </div>
              </div>
              <div className="mobile-record-row">
                <div className="mobile-record-label">Actions</div>
                <div className="mobile-record-value">
                  <div className="admin-actions">
                    <button 
                      className="btn-icon" 
                      title={eq.is_resolved ? "Mark Unresolved" : "Mark Resolved"}
                      onClick={() => handleToggleResolve(eq.id, eq.is_resolved)}
                      style={{ color: eq.is_resolved ? 'var(--color-muted)' : '#065F46', borderColor: eq.is_resolved ? 'var(--color-border)' : '#065F46' }}
                    >
                      {eq.is_resolved ? <FiX size={14} /> : <FiCheck size={14} />}
                    </button>
                    <button className="btn-icon btn-icon--danger" title="Delete" onClick={() => handleDeleteClick(eq.id)}>
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title="Delete Enquiry"
        message="Are you sure you want to delete this enquiry permanently?"
        onConfirm={() => executeDelete(confirmModal.id)}
        onCancel={() => setConfirmModal({ isOpen: false, id: null })}
      />
    </div>
  );
}
