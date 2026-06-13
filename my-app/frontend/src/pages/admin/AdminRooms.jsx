import React, { useEffect, useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiStar } from 'react-icons/fi';
import { 
  getAdminRooms, 
  createAdminRoom, 
  updateAdminRoom, 
  deleteAdminRoom,
  uploadBulkRoomImages,
  deleteRoomImage,
  setMainRoomImage
} from '../../services/api';
import { LoadingSpinner, InlineError } from '../../components/Common/LoadingSpinner';
import { SkeletonGrid } from '../../components/Common/SkeletonLoaders';
import ImageWithFallback from '../../components/Common/ImageWithFallback';
import { getImageUrl, formatCurrency } from '../../utils/helpers';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../components/Common/ConfirmationModal';

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', price_per_day: '',
    floor: 'Ground Floor', room_type: 'Single Bedroom',
    area_sqft: '', display_order: 0,
    is_available: true,
  });
  
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [previewMainIndex, setPreviewMainIndex] = useState(-1);
  const [saving, setSaving] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });

  useEffect(() => {
    if (imageFiles.length > 0) {
      const urls = imageFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
      return () => urls.forEach(url => URL.revokeObjectURL(url));
    } else {
      setPreviewUrls([]);
    }
  }, [imageFiles]);

  const fetchRooms = () => {
    setLoading(true);
    getAdminRooms()
      .then(res => setRooms(res.data))
      .catch(() => setError('Failed to load rooms.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const openModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setForm({
        name: room.name,
        description: room.description || '',
        price_per_day: room.price_per_day,
        floor: room.floor || 'Ground Floor',
        room_type: room.room_type || 'Single Bedroom',
        area_sqft: room.area_sqft || '',
        display_order: room.display_order || 0,
        is_available: room.is_available,
      });
    } else {
      setEditingRoom(null);
      setForm({
        name: '', description: '', price_per_day: '',
        floor: 'Ground Floor', room_type: 'Single Bedroom',
        area_sqft: '', display_order: 0,
        is_available: true,
      });
    }
    setImageFiles([]);
    setPreviewMainIndex(-1);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!form.name.trim()) errors.name = "Room name is required";
    if (!form.floor) errors.floor = "Floor is required";
    if (!form.room_type) errors.room_type = "Room type is required";
    if (!form.area_sqft || parseFloat(form.area_sqft) <= 0) errors.area_sqft = "Area must be > 0";
    if (!form.price_per_day || parseFloat(form.price_per_day) <= 0) errors.price_per_day = "Price must be > 0";

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error('Please fill all required fields correctly.');
      return;
    }

    setSaving(true);
    setUploadStatus('Saving room...');
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));

      let savedRoomId;
      if (editingRoom) {
        await updateAdminRoom(editingRoom.id, formData);
        savedRoomId = editingRoom.id;
      } else {
        const res = await createAdminRoom(formData);
        savedRoomId = res.data.id;
      }

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
          await uploadBulkRoomImages(savedRoomId, imageFormData);
        } catch (imgErr) {
          console.error("Image upload failed:", imgErr);
          toast.warning("Room saved successfully, but some images failed to upload.");
          setIsModalOpen(false);
          fetchRooms();
          return;
        }
      }

      if (!editingRoom && imageFiles.length === 0) {
        toast.warning('Room saved, but no image uploaded.');
      } else if (editingRoom && (!editingRoom.images || editingRoom.images.length === 0) && imageFiles.length === 0) {
        toast.warning('Room saved, but no image uploaded.');
      } else {
        toast.success('Room saved successfully!');
      }
      setIsModalOpen(false);
      fetchRooms();
    } catch (err) {
      toast.error(err.response?.data?.detail || err.response?.data?.name?.[0] || 'Failed to save room. Please check your inputs.');
    } finally {
      setSaving(false);
      setUploadStatus('');
    }
  };

  const executeDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteAdminRoom(id);
      toast.success('Room deleted successfully!');
      fetchRooms();
    } catch (err) {
      toast.error('Failed to delete room.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteClick = (id) => {
    setConfirmModal({ isOpen: true, id });
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
    // Remove main badge from existing images visually
    if (editingRoom) {
      setEditingRoom(prev => {
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

  const handleSetMainImage = async (roomId, imageId) => {
    try {
      await setMainRoomImage(roomId, imageId);
      toast.success('Main image updated.');
      
      // Update local state to reflect change
      setEditingRoom(prev => {
        if (!prev) return prev;
        const newImages = prev.images.map(img => ({
          ...img,
          is_main: img.id === imageId
        }));
        return { ...prev, images: newImages };
      });
      fetchRooms(); // refresh list in background
    } catch (err) {
      toast.error('Failed to update main image.');
    }
  };

  const handleDeleteExistingImage = async (roomId, imageId) => {
    if (window.confirm('Are you sure you want to remove this image?')) {
      try {
        await deleteRoomImage(roomId, imageId);
        toast.success('Image removed.');
        
        setEditingRoom(prev => {
          if (!prev) return prev;
          const newImages = prev.images.filter(img => img.id !== imageId);
          // If we deleted main, refresh fully
          return { ...prev, images: newImages };
        });
        fetchRooms();
      } catch (err) {
        toast.error('Failed to remove image.');
      }
    }
  };

  if (loading && rooms.length === 0) return <div style={{marginTop: 'var(--space-6)'}}><SkeletonGrid count={6} columns={3} /></div>;

  return (
    <div>
      <div className="admin-page-header">
        <h1 style={{ margin: 0 }}>Rooms</h1>
        <div className="admin-header-actions">
          <button className="btn btn-primary" onClick={() => openModal()} style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
            <FiPlus size={16} /> Add Room
          </button>
        </div>
      </div>

      {error && <InlineError message={error} />}

      <div className="grid-3">
        {rooms.map(room => {
          const displayImage = room.main_image_url || room.image_url || (room.images && room.images.length > 0 ? room.images[0].image_url : null);
          return (
            <div key={room.id} className="card">
              <div style={{ height: 180, background: 'var(--color-soft)', position: 'relative' }}>
                {displayImage ? (
                  <ImageWithFallback src={getImageUrl(displayImage)} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-muted)' }}>No Image</div>
                )}
                {!room.is_available && (
                  <div style={{ position: 'absolute', top: 12, right: 12, background: '#DC2626', color: '#fff', padding: '4px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>
                    UNAVAILABLE
                  </div>
                )}
              </div>
            <div className="card-body">
              <h3 style={{ marginBottom: 4 }}>{room.name}</h3>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
                {formatCurrency(room.price_per_day)}/day
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', marginBottom: 'var(--space-4)' }}>
                {room.floor} - {room.room_type} <br />
                {room.area_sqft ? `${room.area_sqft} sq ft` : ''}
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => openModal(room)}>
                  <FiEdit2 size={14} style={{ marginRight: 4 }} /> Edit
                </button>
                <button className="btn btn-outline btn-sm" style={{ padding: '0 12px', color: '#DC2626', borderColor: '#DC2626' }} onClick={() => handleDeleteClick(room.id)} disabled={deletingId === room.id}>
                  {deletingId === room.id ? <div className="spinner" style={{width: 14, height: 14, borderWidth: 2, borderColor: '#DC2626', borderTopColor: 'transparent'}}></div> : <FiTrash2 size={14} />}
                </button>
              </div>
            </div>
          </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 800 }}>
            <form onSubmit={handleSave}>
              <div className="admin-modal__header">
                <h3 style={{ margin: 0 }}>{editingRoom ? 'Edit Room' : 'Add Room'}</h3>
                <button type="button" className="btn-icon" style={{ border: 'none' }} onClick={() => setIsModalOpen(false)}>
                  <FiX size={20} />
                </button>
              </div>
              <div className="admin-modal__body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="form-group">
                  <label className="form-label">Room Name <span style={{color:'red'}}>*</span></label>
                  <input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  {formErrors.name && <div style={{color:'red', fontSize:'12px', marginTop:'4px'}}>{formErrors.name}</div>}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Floor <span style={{color:'red'}}>*</span></label>
                    <select className="form-control" value={form.floor} onChange={e => setForm({...form, floor: e.target.value})}>
                      <option value="Ground Floor">Ground Floor</option>
                      <option value="First Floor">First Floor</option>
                    </select>
                    {formErrors.floor && <div style={{color:'red', fontSize:'12px', marginTop:'4px'}}>{formErrors.floor}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Room Type <span style={{color:'red'}}>*</span></label>
                    <select className="form-control" value={form.room_type} onChange={e => setForm({...form, room_type: e.target.value})}>
                      <option value="Single Bedroom">Single Bedroom</option>
                      <option value="Double Bedroom">Double Bedroom</option>
                      <option value="Triple Bedroom">Triple Bedroom</option>
                    </select>
                    {formErrors.room_type && <div style={{color:'red', fontSize:'12px', marginTop:'4px'}}>{formErrors.room_type}</div>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price Per Day (₹) <span style={{color:'red'}}>*</span></label>
                    <input type="number" className="form-control" value={form.price_per_day} onChange={e => setForm({...form, price_per_day: e.target.value})} />
                    {formErrors.price_per_day && <div style={{color:'red', fontSize:'12px', marginTop:'4px'}}>{formErrors.price_per_day}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Area (Sq Ft) <span style={{color:'red'}}>*</span></label>
                    <input type="number" className="form-control" value={form.area_sqft} onChange={e => setForm({...form, area_sqft: e.target.value})} />
                    {formErrors.area_sqft && <div style={{color:'red', fontSize:'12px', marginTop:'4px'}}>{formErrors.area_sqft}</div>}
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input type="number" className="form-control" value={form.display_order} onChange={e => setForm({...form, display_order: e.target.value})} />
                </div>
                
                <div className="form-group" style={{ marginTop: 'var(--space-6)' }}>
                  <label className="form-label" style={{ fontSize: 'var(--text-lg)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>Images</label>
                  
                  {/* Existing Images Grid */}
                  {editingRoom && editingRoom.images && editingRoom.images.length > 0 && (
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', marginBottom: 'var(--space-2)' }}>Current Images</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 'var(--space-3)' }}>
                        {editingRoom.images.map(img => (
                          <div key={img.id} style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)', height: 120, group: 'hover' }}>
                            <ImageWithFallback src={getImageUrl(img.image_url || img.url || img.image || img.secure_url)} alt="Room" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            
                            {img.is_main ? (
                              <div style={{ position: 'absolute', top: 4, left: 4, background: 'var(--color-primary)', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600 }}>
                                MAIN
                              </div>
                            ) : (
                              <button 
                                type="button"
                                onClick={() => handleSetMainImage(editingRoom.id, img.id)}
                                style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '2px 6px', borderRadius: 4, fontSize: 10, cursor: 'pointer' }}
                              >
                                Set Main
                              </button>
                            )}

                            <button 
                              type="button" 
                              onClick={() => handleDeleteExistingImage(editingRoom.id, img.id)} 
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
                    <input type="file" multiple accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} id="room-images-upload" />
                    <label htmlFor="room-images-upload" className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
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

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'var(--space-4)' }}>
                  <input type="checkbox" id="avail" checked={form.is_available} onChange={e => setForm({...form, is_available: e.target.checked})} />
                  <label htmlFor="avail" style={{ cursor: 'pointer' }}>Is Available for Booking</label>
                </div>
              </div>
              <div className="admin-modal__footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)} disabled={saving}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? uploadStatus : 'Save Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title="Delete Room"
        message="Are you sure you want to delete this room? This action cannot be undone."
        onConfirm={() => executeDelete(confirmModal.id)}
        onCancel={() => setConfirmModal({ isOpen: false, id: null })}
      />
    </div>
  );
}
