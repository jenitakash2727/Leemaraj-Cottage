import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

export default function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel, confirmText = "Delete", isDanger = true }) {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onCancel} style={{ zIndex: 9999 }}>
      <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400, textAlign: 'center', padding: 'var(--space-8)' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: isDanger ? 'rgba(220, 38, 38, 0.1)' : 'var(--color-soft)',
          color: isDanger ? '#DC2626' : 'var(--color-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto var(--space-4)'
        }}>
          <FiAlertTriangle size={32} />
        </div>
        <h3 style={{ margin: '0 0 var(--space-2) 0' }}>{title || "Are you sure?"}</h3>
        <p style={{ color: 'var(--color-muted)', marginBottom: 'var(--space-8)' }}>
          {message || "This action cannot be undone."}
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
          <button className="btn btn-outline" onClick={onCancel} style={{ flex: 1 }}>
            Cancel
          </button>
          <button className="btn" onClick={() => { onConfirm(); onCancel(); }} style={{ flex: 1, background: isDanger ? '#DC2626' : 'var(--color-primary)', color: '#fff' }}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
