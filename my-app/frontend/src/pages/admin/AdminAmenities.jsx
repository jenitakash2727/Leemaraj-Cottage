import React, { useEffect, useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import { getAdminAmenities, createAdminAmenity, updateAdminAmenity, deleteAdminAmenity } from '../../services/api';
import { LoadingSpinner, InlineError } from '../../components/Common/LoadingSpinner';
import { getIcon } from '../../utils/iconMapper';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../components/Common/ConfirmationModal';

export default function AdminAmenities() {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAm, setEditingAm] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });
  const [form, setForm] = useState({ name: '', description: '', icon: 'FiStar', is_active: true });

  const fetchAmenities = () => {
    setLoading(true);
    getAdminAmenities()
      .then(res => setAmenities(res.data))
      .catch(() => setError('Failed to load amenities.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  const openModal = (am = null) => {
    if (am) {
      setEditingAm(am);
      setForm({ name: am.name, description: am.description || '', icon: am.icon || 'FiStar', is_active: am.is_active });
    } else {
      setEditingAm(null);
      setForm({ name: '', description: '', icon: 'FiStar', is_active: true });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingAm) {
        await updateAdminAmenity(editingAm.id, form);
        toast.success("Amenity updated successfully!");
      } else {
        await createAdminAmenity(form);
        toast.success("Amenity created successfully!");
      }
      setIsModalOpen(false);
      fetchAmenities();
    } catch (err) {
      toast.error('Failed to save amenity.');
    }
  };

  const executeDelete = async (id) => {
    try {
      await deleteAdminAmenity(id);
      fetchAmenities();
      toast.success("Amenity deleted successfully!");
    } catch (err) {
      toast.error('Failed to delete amenity.');
    }
  };

  const handleDeleteClick = (id) => {
    setConfirmModal({ isOpen: true, id });
  };

  if (loading && amenities.length === 0) return <LoadingSpinner />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ margin: 0 }}>Amenities</h1>
        <button className="btn btn-primary" onClick={() => openModal()} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <FiPlus size={16} /> Add Amenity
        </button>
      </div>

      {error && <InlineError message={error} />}

      <div className="grid-3">
        {amenities.map(am => (
          <div key={am.id} className="card card-body" style={{ display: 'flex', alignItems: 'flex-start', gap: 16, opacity: am.is_active ? 1 : 0.6 }}>
            <div style={{ width: 48, height: 48, borderRadius: 8, background: 'var(--color-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              {getIcon(am.icon, 20)}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ marginBottom: 4 }}>{am.name}</h4>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', marginBottom: 12 }}>{am.description}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-icon" onClick={() => openModal(am)}><FiEdit2 size={14} /></button>
                <button className="btn-icon btn-icon--danger" onClick={() => handleDeleteClick(am.id)}><FiTrash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSave}>
              <div className="admin-modal__header">
                <h3 style={{ margin: 0 }}>{editingAm ? 'Edit Amenity' : 'Add Amenity'}</h3>
                <button type="button" className="btn-icon" style={{ border: 'none' }} onClick={() => setIsModalOpen(false)}><FiX size={20} /></button>
              </div>
              <div className="admin-modal__body">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">React Icon Name (e.g., FiWifi, FaShower)</label>
                  <input className="form-control" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} required />
                </div>
                <div style={{ marginTop: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} />
                    Is Active
                  </label>
                </div>
              </div>
              <div className="admin-modal__footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Amenity</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title="Delete Amenity"
        message="Are you sure you want to delete this amenity?"
        onConfirm={() => executeDelete(confirmModal.id)}
        onCancel={() => setConfirmModal({ isOpen: false, id: null })}
      />
    </div>
  );
}
