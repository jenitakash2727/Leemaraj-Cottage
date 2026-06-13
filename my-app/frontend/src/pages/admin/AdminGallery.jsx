import React, { useEffect, useState } from 'react';
import { FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import { getAdminGallery, uploadGalleryImage, deleteGalleryImage } from '../../services/api';
import { LoadingSpinner, InlineError } from '../../components/Common/LoadingSpinner';
import ImageWithFallback from '../../components/Common/ImageWithFallback';
import { getImageUrl } from '../../utils/helpers';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../components/Common/ConfirmationModal';

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'exterior' });
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (imageFiles.length > 0) {
      const urls = imageFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
      return () => urls.forEach(url => URL.revokeObjectURL(url));
    } else {
      setPreviewUrls([]);
    }
  }, [imageFiles]);

  const fetchGallery = () => {
    setLoading(true);
    getAdminGallery()
      .then(res => setImages(res.data))
      .catch(() => setError('Failed to load gallery images.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openModal = () => {
    setForm({ title: '', category: 'exterior' });
    setImageFiles([]);
    setIsModalOpen(true);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const errors = {};
    if (imageFiles.length === 0) {
      errors.imageFiles = 'Please select at least one image file to upload.';
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error('Please select at least one image file to upload.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('category', form.category);
      imageFiles.forEach(file => formData.append('images', file));

      await uploadGalleryImage(formData);
      setIsModalOpen(false);
      toast.success('Images uploaded successfully!');
      fetchGallery();
    } catch (err) {
      toast.error(err.response?.data?.category?.[0] || err.response?.data?.detail || 'Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeSelectedImage = (index) => {
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);
  };

  const executeDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteGalleryImage(id);
      fetchGallery();
      toast.success('Image deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete image.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteClick = (id) => {
    setConfirmModal({ isOpen: true, id });
  };

  if (loading && images.length === 0) return <LoadingSpinner />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ margin: 0 }}>Gallery</h1>
        <button className="btn btn-primary" onClick={openModal} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <FiPlus size={16} /> Upload Image
        </button>
      </div>

      {error && <InlineError message={error} />}

      <div className="grid-3" style={{ gap: 'var(--space-4)' }}>
        {images.map(img => (
          <div key={img.id} style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
            <div style={{ aspectRatio: '4/3', background: 'var(--color-bg)' }}>
              <ImageWithFallback src={getImageUrl(img.image_url || img.image)} alt={img.title} />
            </div>
            <div style={{ padding: 'var(--space-3)', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{img.title}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', textTransform: 'capitalize' }}>{img.category}</div>
              </div>
              <button className="btn-icon btn-icon--danger" onClick={() => handleDeleteClick(img.id)} disabled={deletingId === img.id}>
                {deletingId === img.id ? <div className="spinner" style={{width: 14, height: 14, borderWidth: 2}}></div> : <FiTrash2 size={14} />}
              </button>
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--space-10)', background: 'var(--color-soft)', borderRadius: 'var(--radius-lg)' }}>
            No images uploaded yet.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => !uploading && setIsModalOpen(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleUpload}>
              <div className="admin-modal__header">
                <h3 style={{ margin: 0 }}>Upload Image</h3>
                <button type="button" className="btn-icon" style={{ border: 'none' }} onClick={() => !uploading && setIsModalOpen(false)}>
                  <FiX size={20} />
                </button>
              </div>
              <div className="admin-modal__body">
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input className="form-control" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                  <small className="text-muted" style={{display: 'block', marginTop: 4}}>Optional. If multiple files, index will be appended. Filename is used if empty.</small>
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-control" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    <option value="exterior">Exterior &amp; Views</option>
                    <option value="bedroom">Bedroom</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="dining">Dining Area</option>
                    <option value="lounge">Lounge / Living</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Image Files <span style={{color:'red'}}>*</span></label>
                  <input type="file" className="form-control" accept="image/*" multiple onChange={e => {
                      setImageFiles([...imageFiles, ...Array.from(e.target.files)]);
                      if (e.target.files.length > 0) setFormErrors({...formErrors, imageFiles: null});
                    }} />
                  {formErrors.imageFiles && <div style={{color:'red', fontSize:'12px', marginTop:'4px'}}>{formErrors.imageFiles}</div>}
                  
                  {previewUrls.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                      {previewUrls.map((url, index) => {
                        const file = imageFiles[index];
                        return (
                          <div key={index} style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
                            <img src={url} alt={`Preview ${index}`} style={{ width: '100%', height: 100, objectFit: 'cover' }} />
                            <div style={{ padding: 'var(--space-1)', fontSize: 10, background: 'var(--color-soft)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%', textAlign: 'center' }}>{file?.name}</span>
                              <span>{file ? (file.size / 1024 / 1024).toFixed(2) : 0} MB</span>
                            </div>
                            <button type="button" onClick={() => removeSelectedImage(index)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                              <FiX size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div className="admin-modal__footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)} disabled={uploading}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={uploading || imageFiles.length === 0}>
                  {uploading ? 'Uploading...' : `Upload ${imageFiles.length > 0 ? imageFiles.length : ''} Image${imageFiles.length > 1 ? 's' : ''}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title="Delete Gallery Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        onConfirm={() => executeDelete(confirmModal.id)}
        onCancel={() => setConfirmModal({ isOpen: false, id: null })}
      />
    </div>
  );
}
