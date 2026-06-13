import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiX, FiChevronLeft, FiChevronRight, FiGrid } from 'react-icons/fi';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';
import { SkeletonGrid } from '../components/Common/SkeletonLoaders';
import { getGallery } from '../services/api';
import { getImageUrl } from '../utils/helpers';
import { useScrollReveal } from '../AnimationUtils';
import ImageWithFallback from '../components/Common/ImageWithFallback';

// Removed local gallery images

const CATEGORIES = ['All', 'bedroom', 'kitchen', 'dining', 'lounge', 'exterior'];

export default function GalleryPage() {
  useScrollReveal();
  const [images,         setImages]         = useState([]);
  const [filtered,       setFiltered]       = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading,        setLoading]        = useState(true);
  const [lightbox,       setLightbox]       = useState({ open: false, index: 0 });

  useEffect(() => {
    getGallery()
      .then(r => {
        const apiImgs = r.data || [];
        // Map API images to the same shape as local images
        const mapped = apiImgs.map(img => ({
          id: `api-${img.id}`,
          title: img.title,
          image: getImageUrl(img.image_url || img.image),
          category: img.category || 'general',
        }));
        // Use local images as fallback/supplement
        setImages(mapped);
      })
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFiltered(images);
    } else {
      setFiltered(images.filter(img => img.category === activeCategory));
    }
  }, [images, activeCategory]);

  // Lightbox controls
  const openLightbox  = (idx) => setLightbox({ open: true,  index: idx });
  const closeLightbox = useCallback(() => setLightbox({ open: false, index: 0 }), []);
  const prevImage = useCallback(() =>
    setLightbox(l => ({ ...l, index: (l.index - 1 + filtered.length) % filtered.length })), [filtered.length]);
  const nextImage = useCallback(() =>
    setLightbox(l => ({ ...l, index: (l.index + 1) % filtered.length })), [filtered.length]);

  // Keyboard nav
  useEffect(() => {
    if (!lightbox.open) return;
    const handler = (e) => {
      if (e.key === 'ArrowLeft')  prevImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'Escape')     closeLightbox();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox.open, prevImage, nextImage, closeLightbox]);

  const currentImage = filtered[lightbox.index];

  return (
    <main className="page-wrapper">
      <Helmet>
        <title>Photo Gallery | Leema Raj Cottage Stay</title>
        <meta name="description" content="Explore every corner of Leema Raj Cottage Stay. View our spacious rooms, dining areas, and beautiful exteriors." />
      </Helmet>

      <div className="compact-page-header">
        <div className="container">
          <h1>Photo Gallery</h1>
          <p>Explore every corner of Leema Raj Cottage Stay</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Category Filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', justifyContent: 'center', marginBottom: 'var(--space-10)' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {cat === 'All' ? <><FiGrid size={12} style={{ marginRight: 4 }} /> All</>  : cat}
              </button>
            ))}
          </div>

          {loading && <SkeletonGrid count={6} columns={3} />}

          {!loading && filtered.length === 0 && (
            <div className="text-center" style={{ padding: 'var(--space-16)', color: 'var(--color-muted)' }}>
              <p>No images found in this category.</p>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
              {filtered.map((img, i) => (
                <div
                  key={img.id}
                  className="reveal gallery-item-premium"
                  style={{
                    display: 'inline-block',
                    width: '100%',
                    marginBottom: 'var(--space-4)',
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  onClick={() => openLightbox(i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && openLightbox(i)}
                  aria-label={`View ${img.title}`}
                  onMouseEnter={(e) => {
                    const imgEl = e.currentTarget.querySelector('img');
                    const overlayEl = e.currentTarget.querySelector('.gallery-overlay');
                    if (imgEl) imgEl.style.transform = 'scale(1.08)';
                    if (overlayEl) {
                        overlayEl.style.opacity = '1';
                        const title = overlayEl.querySelector('.overlay-title');
                        const subtitle = overlayEl.querySelector('.overlay-subtitle');
                        if (title) title.style.transform = 'translateY(0)';
                        if (subtitle) subtitle.style.transform = 'translateY(0)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const imgEl = e.currentTarget.querySelector('img');
                    const overlayEl = e.currentTarget.querySelector('.gallery-overlay');
                    if (imgEl) imgEl.style.transform = 'scale(1)';
                    if (overlayEl) {
                        overlayEl.style.opacity = '0';
                        const title = overlayEl.querySelector('.overlay-title');
                        const subtitle = overlayEl.querySelector('.overlay-subtitle');
                        if (title) title.style.transform = 'translateY(10px)';
                        if (subtitle) subtitle.style.transform = 'translateY(10px)';
                    }
                  }}
                >
                  <ImageWithFallback
                    src={img.image}
                    alt={img.title}
                    style={{ width: '100%', height: 'auto', display: 'block', transition: 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)' }}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'var(--space-6)',
                  }}
                  className="gallery-overlay">
                    <p style={{ color: '#fff', fontSize: 'var(--text-lg)', fontWeight: 600, margin: '0 0 4px 0', transform: 'translateY(10px)', transition: 'transform 0.3s ease' }} className="overlay-title">{img.title}</p>
                    <p style={{ color: 'var(--color-accent)', fontSize: 'var(--text-sm)', margin: 0, transform: 'translateY(10px)', transition: 'transform 0.3s ease 0.05s' }} className="overlay-subtitle">View Image</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Lightbox ─────────────────────────── */}
      {lightbox.open && currentImage && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 'var(--z-modal)',
            background: 'rgba(0,0,0,0.93)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Close */}
          <button
            style={{
              position: 'absolute', top: 20, right: 20, zIndex: 1,
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'background 0.2s',
            }}
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <FiX size={20} />
          </button>

          {/* Prev */}
          <button
            style={{
              position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
              width: 48, height: 48, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 1,
            }}
            onClick={e => { e.stopPropagation(); prevImage(); }}
            aria-label="Previous image"
          >
            <FiChevronLeft size={24} />
          </button>

          {/* Image */}
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '90vh', textAlign: 'center' }}>
            <img
              src={currentImage.image}
              alt={currentImage.title}
              style={{
                maxWidth: '85vw', maxHeight: '80vh',
                objectFit: 'contain', borderRadius: 'var(--radius-lg)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
              }}
            />
            <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
              {currentImage.title} <span style={{ color: 'rgba(255,255,255,0.4)', marginLeft: 8 }}>
                {lightbox.index + 1} / {filtered.length}
              </span>
            </p>
          </div>

          {/* Next */}
          <button
            style={{
              position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
              width: 48, height: 48, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 1,
            }}
            onClick={e => { e.stopPropagation(); nextImage(); }}
            aria-label="Next image"
          >
            <FiChevronRight size={24} />
          </button>
        </div>
      )}
    </main>
  );
}
