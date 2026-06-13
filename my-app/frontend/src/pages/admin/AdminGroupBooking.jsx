import React, { useEffect, useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import { 
  getAdminPackages, 
  updateAdminPackage, 
  uploadBulkPackageImages,
  deletePackageImage,
  setMainPackageImage
} from '../../services/api';
import { LoadingSpinner, InlineError } from '../../components/Common/LoadingSpinner';
import ImageWithFallback from '../../components/Common/ImageWithFallback';
import { getImageUrl, formatCurrency } from '../../utils/helpers';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../components/Common/ConfirmationModal';

export default function AdminGroupBooking() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });
  const [form, setForm] = useState({
    title: '', min_guest_count: 35, price: '', duration: '24 Hours',
    description: '', no_extra_charges: true, is_available: true,
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [previewMainIndex, setPreviewMainIndex] = useState(-1);
  const [saving, setSaving] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
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

  const fetchPackages = () => {
    setLoading(true);
    getAdminPackages()
      .then(res => setPackages(res.data))
      .catch(() => setError('Failed to load group bookings.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const openModal = (pkg = null) => {
    if (pkg) {
      setEditingPkg(pkg);
      setForm({
        title: pkg.title, min_guest_count: pkg.min_guest_count || 35, price: pkg.price,
        duration: pkg.duration, description: pkg.description || '',
        no_extra_charges: pkg.no_extra_charges, is_available: pkg.is_available,
      });
    } else {
      setEditingPkg(null);
      setForm({
        title: '', min_guest_count: 35, price: '', duration: '24 Hours',
        description: '', no_extra_charges: true, is_available: true,
      });
    }
    setImageFiles([]);
    setPreviewMainIndex(-1);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!form.title.trim()) errors.title = "Title is required";
    if (!form.min_guest_count || parseInt(form.min_guest_count) < 35) errors.min_guest_count = "Must be at least 35";
    if (!form.price || parseFloat(form.price) <= 0) errors.price = "Price must be > 0";
    if (!form.duration.trim()) errors.duration = "Duration is required";

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error('Please fill all required fields correctly.');
      return;
    }

    setSaving(true);
    setUploadStatus('Saving group booking...');
    try {
      const payload = {
        ...form,
        guest_range: `> ${form.min_guest_count} members`,
      };
      
      let savedPkgId = editingPkg.id;
      await updateAdminPackage(savedPkgId, payload);

      // Handle bulk image upload
      if (imageFiles.length > 0) {
        try {
          setUploadStatus('Uploading images...');
          const imageFormData = new FormData();
          imageFiles.forEach(file => {
            imageFormData.append('images', file);
          });
          if (previewMainIndex !== null && previewMainIndex >= 0) {
            imageFormData.append('main_index', previewMainIndex);
          }
          await uploadBulkPackageImages(savedPkgId, imageFormData);
        } catch (imgErr) {
          console.error("Image upload failed:", imgErr);
          toast.warning("Group booking saved, but some images failed to upload.");
          setIsModalOpen(false);
          fetchPackages();
          return;
        }
      }

      if (!editingPkg && imageFiles.length === 0) {
        toast.warning('Group booking saved, but no image uploaded.');
      } else if (editingPkg && (!editingPkg.images || editingPkg.images.length === 0) && imageFiles.length === 0) {
        toast.warning('Group booking saved, but no image uploaded.');
      } else {
        toast.success("Group booking saved successfully!");
      }
      setIsModalOpen(false);
      fetchPackages();
    } catch (err) {
      toast.error(err.response?.data?.detail || err.response?.data?.title?.[0] || 'Failed to save group booking.');
    } finally {
      setSaving(false);
      setUploadStatus('');
    }
  };



  const handleRemovePreview = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    if (previewMainIndex === index) {
      setPreviewMainIndex(-1); // fallback to no main explicitly selected
    } else if (previewMainIndex > index) {
      setPreviewMainIndex(prev => prev - 1);
    }
  };

  const handleSetPreviewMain = (index) => {
    setPreviewMainIndex(index);
    if (editingPkg) {
      setEditingPkg(prev => {
        if (!prev) return prev;
        const newImages = prev.images.map(img => ({ ...img, is_main: false }));
        return { ...prev, images: newImages };
      });
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      setImageFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const handleSetMainImage = async (pkgId, imageId) => {
    try {
      await setMainPackageImage(pkgId, imageId);
      toast.success('Main image updated.');
      
      setEditingPkg(prev => {
        if (!prev) return prev;
        const newImages = prev.images.map(img => ({
          ...img,
          is_main: img.id === imageId
        }));
        return { ...prev, images: newImages };
      });
      fetchPackages();
    } catch (err) {
      toast.error('Failed to update main image.');
    }
  };

  const handleDeleteExistingImage = async (pkgId, imageId) => {
    if (window.confirm('Are you sure you want to remove this image?')) {
      try {
        await deletePackageImage(pkgId, imageId);
        toast.success('Image removed.');
        
        setEditingPkg(prev => {
          if (!prev) return prev;
          const newImages = prev.images.filter(img => img.id !== imageId);
          return { ...prev, images: newImages };
        });
        fetchPackages();
      } catch (err) {
        toast.error('Failed to remove image.');
      }
    }
  };

  if (loading && packages.length === 0) return <LoadingSpinner />;

  return (
    <div>
      <div className="admin-page-header">
        <h1 style={{ margin: 0 }}>Group Bookings</h1>
      </div>

      {error && <InlineError message={error} />}

      <div className="admin-table-scroll desktop-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Guest Range</th>
              <th>Price</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map(p => {
              const displayImage = p.main_image_url || (p.images && p.images.length > 0 ? p.images[0].image_url : null);
              return (
              <tr key={p.id}>
                <td>
                  <div style={{ width: 60, height: 40, borderRadius: 4, overflow: 'hidden', background: 'var(--color-soft)' }}>
                    {displayImage ? (
                      <ImageWithFallback src={getImageUrl(displayImage)} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-muted)' }}>No Img</div>
                    )}
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{p.title}</td>
                <td>{p.guest_range}</td>
                <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{formatCurrency(p.price)}</td>
                <td>{p.duration}</td>
                <td>
                  <span className={`status-badge ${p.is_available ? 'status-badge--confirmed' : 'status-badge--cancelled'}`}>
                    {p.is_available ? 'Available' : 'Hidden'}
                  </span>
                </td>
                <td>
                  <div className="admin-actions">
                    <button className="btn-icon" onClick={() => openModal(p)}><FiEdit2 size={14} /></button>
                  </div>
                </td>
              </tr>
            )})}
            {packages.length === 0 && (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>No group bookings.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mobile-records-list">
        {packages.length === 0 ? (
          <div className="mobile-record-card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            No group bookings.
          </div>
        ) : (
          packages.map(p => {
            const displayImage = p.main_image_url || (p.images && p.images.length > 0 ? p.images[0].image_url : null);
            return (
            <div key={p.id} className="mobile-record-card">
              <div className="mobile-record-row">
                <div className="mobile-record-label">Image</div>
                <div className="mobile-record-value">
                  <div style={{ width: 60, height: 40, borderRadius: 4, overflow: 'hidden', background: 'var(--color-soft)' }}>
                    {displayImage ? (
                      <ImageWithFallback src={getImageUrl(displayImage)} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-muted)' }}>No Img</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mobile-record-row">
                <div className="mobile-record-label">Title</div>
                <div className="mobile-record-value" style={{ fontWeight: 600 }}>{p.title}</div>
              </div>
              <div className="mobile-record-row">
                <div className="mobile-record-label">Guest Range</div>
                <div className="mobile-record-value">{p.guest_range}</div>
              </div>
              <div className="mobile-record-row">
                <div className="mobile-record-label">Price</div>
                <div className="mobile-record-value" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{formatCurrency(p.price)}</div>
              </div>
              <div className="mobile-record-row">
                <div className="mobile-record-label">Duration</div>
                <div className="mobile-record-value">{p.duration}</div>
              </div>
              <div className="mobile-record-row">
                <div className="mobile-record-label">Status</div>
                <div className="mobile-record-value">
                  <span className={`status-badge ${p.is_available ? 'status-badge--confirmed' : 'status-badge--cancelled'}`}>
                    {p.is_available ? 'Available' : 'Hidden'}
                  </span>
                </div>
              </div>
              <div className="mobile-record-row">
                <div className="mobile-record-label">Actions</div>
                <div className="mobile-record-value">
                  <div className="admin-actions">
                    <button className="btn-icon" onClick={() => openModal(p)}><FiEdit2 size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          )})
        )}
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 800 }}>
            <form onSubmit={handleSave}>
              <div className="admin-modal__header">
                <h3 style={{ margin: 0 }}>{editingPkg ? 'Edit Group Booking' : 'Add Group Booking'}</h3>
                <button type="button" className="btn-icon" style={{ border: 'none' }} onClick={() => setIsModalOpen(false)}>
                  <FiX size={20} />
                </button>
              </div>
              <div className="admin-modal__body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="form-group">
                  <label className="form-label">Title <span style={{color:'red'}}>*</span></label>
                  <input className="form-control" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                  {formErrors.title && <div style={{color:'red', fontSize:'12px', marginTop:'4px'}}>{formErrors.title}</div>}
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Minimum Guests Required <span style={{color:'red'}}>*</span></label>
                    <input type="number" className="form-control" value={form.min_guest_count} onChange={e => setForm({...form, min_guest_count: parseInt(e.target.value) || 0})} />
                    {formErrors.min_guest_count && <div style={{color:'red', fontSize:'12px', marginTop:'4px'}}>{formErrors.min_guest_count}</div>}
                    <div style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '4px' }}>Displays as "Above {form.min_guest_count} members"</div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price (₹) <span style={{color:'red'}}>*</span></label>
                    <input type="number" className="form-control" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                    {formErrors.price && <div style={{color:'red', fontSize:'12px', marginTop:'4px'}}>{formErrors.price}</div>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Duration <span style={{color:'red'}}>*</span></label>
                  <input className="form-control" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} />
                  {formErrors.duration && <div style={{color:'red', fontSize:'12px', marginTop:'4px'}}>{formErrors.duration}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Description (Optional)</label>
                  <textarea className="form-control" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>

                <div className="form-group" style={{ marginTop: 'var(--space-6)' }}>
                  <label className="form-label" style={{ fontSize: 'var(--text-lg)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>Images</label>
                  
                  {/* Existing Images Grid */}
                  {editingPkg && editingPkg.images && editingPkg.images.length > 0 && (
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', marginBottom: 'var(--space-2)' }}>Current Images</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 'var(--space-3)' }}>
                        {editingPkg.images.map(img => (
                          <div key={img.id} style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)', height: 120, group: 'hover' }}>
                            <ImageWithFallback src={getImageUrl(img.image_url || img.url || img.image || img.secure_url)} alt="Group Booking" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            
                            {img.is_main ? (
                              <div style={{ position: 'absolute', top: 4, left: 4, background: 'var(--color-primary)', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600 }}>
                                MAIN
                              </div>
                            ) : (
                              <button 
                                type="button"
                                onClick={() => handleSetMainImage(editingPkg.id, img.id)}
                                style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '2px 6px', borderRadius: 4, fontSize: 10, cursor: 'pointer' }}
                              >
                                Set Main
                              </button>
                            )}

                            <button 
                              type="button" 
                              onClick={() => handleDeleteExistingImage(editingPkg.id, img.id)} 
                              style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(220, 38, 38, 0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            >
                              <FiX size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload New Images */}
                  <div style={{ border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', textAlign: 'center', background: 'var(--color-soft)' }}>
                    <FiPlus size={24} style={{ color: 'var(--color-muted)', marginBottom: 'var(--space-2)' }} />
                    <p style={{ margin: '0 0 var(--space-2) 0', fontWeight: 500 }}>Upload New Images</p>
                    <input type="file" multiple accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} id="pkg-images-upload" />
                    <label htmlFor="pkg-images-upload" className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                      Select Files
                    </label>
                  </div>

                  {/* Previews for new uploads */}
                  {previewUrls.length > 0 && (
                    <div style={{ marginTop: 'var(--space-4)' }}>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', marginBottom: 'var(--space-2)' }}>To be uploaded ({previewUrls.length})</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 'var(--space-3)' }}>
                        {previewUrls.map((url, index) => (
                          <div key={index} style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: previewMainIndex === index ? '2px solid var(--color-primary)' : '1px solid var(--color-border)', height: 120 }}>
                            <img src={url} alt={`Preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            
                            {previewMainIndex === index ? (
                              <div style={{ position: 'absolute', top: 4, left: 4, background: 'var(--color-primary)', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600 }}>
                                MAIN
                              </div>
                            ) : (
                              <button 
                                type="button"
                                onClick={() => handleSetPreviewMain(index)}
                                style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '2px 6px', borderRadius: 4, fontSize: 10, cursor: 'pointer' }}
                              >
                                Set Main
                              </button>
                            )}

                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 10, padding: '2px 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {imageFiles[index]?.name} ({(imageFiles[index]?.size / 1024 / 1024).toFixed(1)}MB)
                            </div>
                            <button type="button" onClick={() => handleRemovePreview(index)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(220, 38, 38, 0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                              <FiX size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 16, marginTop: 'var(--space-4)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.no_extra_charges} onChange={e => setForm({...form, no_extra_charges: e.target.checked})} />
                    Shows "No Extra Charges"
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.is_available} onChange={e => setForm({...form, is_available: e.target.checked})} />
                    Is Available
                  </label>
                </div>
              </div>
              <div className="admin-modal__footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)} disabled={saving}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? uploadStatus : 'Save Group Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}
