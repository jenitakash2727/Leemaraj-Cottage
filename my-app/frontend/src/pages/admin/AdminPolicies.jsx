import React, { useEffect, useState } from 'react';
import { FiEdit2, FiX } from 'react-icons/fi';
import { getAdminPolicies, updateAdminPolicy } from '../../services/api';
import { LoadingSpinner, InlineError } from '../../components/Common/LoadingSpinner';
import { toast } from 'react-toastify';

export default function AdminPolicies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [content, setContent] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const fetchPolicies = () => {
    setLoading(true);
    getAdminPolicies()
      .then(res => setPolicies(res.data))
      .catch(() => setError('Failed to load policies.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const openModal = (policy) => {
    setEditingPolicy(policy);
    setContent(policy.content);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setFormErrors({ content: 'Policy content is required' });
      toast.error('Please fill all required fields correctly.');
      return;
    }
    try {
      await updateAdminPolicy(editingPolicy.id, { content });
      toast.success("Policy updated successfully!");
      setIsModalOpen(false);
      fetchPolicies();
    } catch (err) {
      toast.error('Failed to update policy.');
    }
  };

  if (loading && policies.length === 0) return <LoadingSpinner />;

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ margin: 0 }}>House Rules &amp; Policies</h1>
        <p className="text-muted">Manage the cancellation, check-in, and terms shown to guests.</p>
      </div>

      {error && <InlineError message={error} />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {policies.map(p => (
          <div key={p.id} className="card card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, paddingRight: 'var(--space-8)' }}>
              <h3 style={{ marginBottom: 'var(--space-2)' }}>{p.title}</h3>
              <p style={{ whiteSpace: 'pre-line', fontSize: 'var(--text-sm)', color: 'var(--color-muted)', lineHeight: 1.7 }}>
                {p.content}
              </p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => openModal(p)} style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <FiEdit2 size={14} /> Edit
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && editingPolicy && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSave}>
              <div className="admin-modal__header">
                <h3 style={{ margin: 0 }}>Edit {editingPolicy.title}</h3>
                <button type="button" className="btn-icon" style={{ border: 'none' }} onClick={() => setIsModalOpen(false)}>
                  <FiX size={20} />
                </button>
              </div>
              <div className="admin-modal__body">
                <div className="form-group">
                  <label className="form-label">Policy Content <span style={{color:'red'}}>*</span></label>
                  <textarea 
                    className="form-control" 
                    rows={8} 
                    value={content} 
                    onChange={e => {
                      setContent(e.target.value);
                      if(e.target.value.trim()) setFormErrors({});
                    }} 
                  />
                  {formErrors.content && <div style={{color:'red', fontSize:'12px', marginTop:'4px'}}>{formErrors.content}</div>}
                  <small style={{ color: 'var(--color-muted)', display: 'block', marginTop: 4 }}>
                    Use new lines to separate bullet points for terms & conditions.
                  </small>
                </div>
              </div>
              <div className="admin-modal__footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
