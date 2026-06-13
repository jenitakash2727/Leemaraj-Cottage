import axios from 'axios';

/**
 * Axios instance pre-configured for the Django backend.
 *
 * Base URL is read from REACT_APP_API_BASE_URL environment variable.
 * Production: https://leemaraj-cottage.onrender.com/api
 * Local dev:  http://127.0.0.1:8001/api
 *
 * Usage:
 *   import api from '../services/api';
 *   const { data } = await api.get('/rooms/');
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://leemaraj-cottage.onrender.com/api',
  timeout: 30000,
});

/* ── Request interceptor — attach JWT token if present ── */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ── Response interceptor — handle 401 gracefully ── */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — clear local storage
      localStorage.clear();
      // Redirect to login (do not import navigate here to avoid circular deps)
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/* ═══════════════════════════════════════════════════
   Typed API Helper Functions
   (Not connected to pages yet — Step 6 will wire these)
═══════════════════════════════════════════════════ */

// ── Public ────────────────────────────────────────

export const getRooms         = ()        => api.get('/rooms/');
export const getRoomById      = (id)      => api.get(`/rooms/${id}/`);
export const getPackages      = ()        => api.get('/packages/');
export const getPackageById   = (id)      => api.get(`/packages/${id}/`);
export const getAmenities     = ()        => api.get('/amenities/');
export const getGallery       = (cat)     => api.get('/gallery/', { params: cat ? { category: cat } : {} });
export const getPolicies      = ()        => api.get('/policies/');
export const createBooking    = (data)    => api.post('/bookings/', data);
export const checkAvailability= (data)    => api.post('/check-availability/', data);
export const createEnquiry    = (data)    => api.post('/contact/', data);

// ── Auth ──────────────────────────────────────────

export const adminLogin   = (credentials) => api.post('/auth/login/', credentials);
export const refreshToken = (refresh)     => api.post('/auth/refresh/', { refresh });
export const googleLogin  = (credential)  => api.post('/auth/google-login/', { credential });
export const supabaseLogin= (data)        => api.post('/auth/supabase-login/', data);

// ── Customer ──────────────────────────────────────
export const getMyBookings = () => api.get('/my-bookings/');

// ── Admin — Bookings ──────────────────────────────

export const getAdminBookings      = (filters) => api.get('/admin/bookings/', { params: filters });
export const getAdminBookingById   = (id)       => api.get(`/admin/bookings/${id}/`);
export const updateAdminBooking    = (id, data) => api.patch(`/admin/bookings/${id}/`, data);
export const deleteAdminBooking    = (id)       => api.delete(`/admin/bookings/${id}/`);

// ── Admin — Rooms ─────────────────────────────────

export const getAdminRooms     = ()        => api.get('/admin/rooms/');
export const createAdminRoom   = (data)    => api.post('/admin/rooms/', data);
export const updateAdminRoom   = (id, data)=> api.patch(`/admin/rooms/${id}/`, data);
export const deleteAdminRoom   = (id)      => api.delete(`/admin/rooms/${id}/`);

export const uploadRoomImage      = (roomId, data) => api.post(`/admin/rooms/${roomId}/images/`, data);
export const uploadBulkRoomImages = (roomId, data) => api.post(`/admin/rooms/${roomId}/images/bulk-upload/`, data);
export const deleteRoomImage      = (roomId, imgId) => api.delete(`/admin/rooms/${roomId}/images/${imgId}/`);
export const setMainRoomImage  = (roomId, imgId) => api.patch(`/admin/rooms/${roomId}/images/${imgId}/set-main/`);

// ── Admin — Packages ──────────────────────────────

export const getAdminPackages    = ()         => api.get('/admin/packages/');
export const createAdminPackage  = (data)     => api.post('/admin/packages/', data);
export const updateAdminPackage  = (id, data) => api.patch(`/admin/packages/${id}/`, data);
export const deleteAdminPackage  = (id)       => api.delete(`/admin/packages/${id}/`);

export const uploadPackageImage   = (pkgId, data) => api.post(`/admin/packages/${pkgId}/images/`, data);
export const uploadBulkPackageImages = (pkgId, data) => api.post(`/admin/packages/${pkgId}/images/bulk-upload/`, data);
export const deletePackageImage   = (pkgId, imgId) => api.delete(`/admin/packages/${pkgId}/images/${imgId}/`);
export const setMainPackageImage  = (pkgId, imgId) => api.patch(`/admin/packages/${pkgId}/images/${imgId}/set-main/`);

// ── Admin — Amenities ─────────────────────────────

export const getAdminAmenities   = ()         => api.get('/admin/amenities/');
export const createAdminAmenity  = (data)     => api.post('/admin/amenities/', data);
export const updateAdminAmenity  = (id, data) => api.patch(`/admin/amenities/${id}/`, data);
export const deleteAdminAmenity  = (id)       => api.delete(`/admin/amenities/${id}/`);

// ── Admin — Gallery ───────────────────────────────

export const getAdminGallery     = ()         => api.get('/admin/gallery/');
export const uploadGalleryImage  = (formData) => api.post('/admin/gallery/', formData);
export const deleteGalleryImage  = (id)       => api.delete(`/admin/gallery/${id}/`);

// ── Admin — Policies ──────────────────────────────

export const getAdminPolicies    = ()         => api.get('/admin/policies/');
export const updateAdminPolicy   = (id, data) => api.patch(`/admin/policies/${id}/`, data);

// ── Admin — Enquiries ─────────────────────────────

export const getAdminEnquiries   = (filters) => api.get('/admin/enquiries/', { params: filters });
export const updateAdminEnquiry  = (id, data)=> api.patch(`/admin/enquiries/${id}/`, data);
export const deleteAdminEnquiry  = (id)      => api.delete(`/admin/enquiries/${id}/`);

// ── Admin — Stats ─────────────────────────────────

export const getAdminStats = () => api.get('/admin/stats/');

export default api;
