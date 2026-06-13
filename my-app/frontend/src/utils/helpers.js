// ── Image URL helper ─────────────────────────────────────────────
// Points to the Django backend for resolving relative /media/ paths.
// Cloudinary images are already absolute URLs and bypass this entirely.
const API_BASE = process.env.REACT_APP_BACKEND_BASE_URL || 'https://leemaraj-cottage.onrender.com';

/**
 * Returns a fully-qualified image URL.
 * Handles:
 *  - null/undefined → null
 *  - already absolute URLs → as-is
 *  - /media/... relative paths → prepend API_BASE
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
  if (imageUrl.startsWith('/media/')) return `${API_BASE}${imageUrl}`;
  return `${API_BASE}${imageUrl}`;
};

// ── Currency formatting ──────────────────────────────────────────
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '—';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

// ── Phone formatting ─────────────────────────────────────────────
export const formatPhone = (num) => {
  if (!num) return '';
  const digits = num.replace(/\D/g, '');
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
};

// ── Validate check-in time (not 10 PM – 5 AM) ───────────────────
export const isValidCheckInTime = (timeString) => {
  if (!timeString) return false;
  const [hh, mm] = timeString.split(':').map(Number);
  const totalMinutes = hh * 60 + mm;
  const restrictedStart = 22 * 60; // 10 PM
  const restrictedEnd   =  5 * 60; //  5 AM
  // Invalid if >= 10 PM OR < 5 AM
  return !(totalMinutes >= restrictedStart || totalMinutes < restrictedEnd);
};

// ── Phone validation ─────────────────────────────────────────────
export const isValidPhone = (phone) => {
  if (!phone) return false;
  return phone.replace(/\D/g, '').length >= 10;
};
