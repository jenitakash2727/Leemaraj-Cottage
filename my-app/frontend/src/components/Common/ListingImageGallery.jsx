import React, { useState, useEffect, useCallback } from 'react';
import { FiGrid, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import './ListingImageGallery.css';

export default function ListingImageGallery({ images, title, mainImage }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Combine main image with other images, remove duplicates by URL
  let allImages = [];
  if (mainImage) {
    allImages.push(mainImage);
  }
  
  if (images && images.length > 0) {
    images.forEach(img => {
      const url = img.image_url || img.image || img;
      if (!allImages.includes(url) && url !== mainImage) {
        allImages.push(url);
      }
    });
  }

  // Handle keyboard navigation for lightbox
  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e) => {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxOpen, nextImage, prevImage, closeLightbox]);

  if (allImages.length === 0) return null;

  const displayMain = allImages[0];
  const thumbnails = allImages.slice(1, 5);
  const remainingCount = allImages.length > 5 ? allImages.length - 5 : 0;

  return (
    <div className="listing-gallery-container">
      <div className="listing-gallery-grid" onClick={() => { setLightboxOpen(true); setCurrentIndex(0); }}>
        <div className="lg-main-img">
          <img src={displayMain} alt={`${title} main view`} />
        </div>
        <div className={`lg-thumbnails thumb-count-${thumbnails.length}`}>
          {thumbnails.map((img, index) => {
            const isLast = index === thumbnails.length - 1;
            return (
              <div key={index} className="lg-thumb-item">
                <img src={img} alt={`${title} view ${index + 2}`} />
                {isLast && remainingCount > 0 && (
                  <div className="lg-more-overlay">
                    <span>+{remainingCount} Photos</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <button className="btn btn-outline lg-view-all-btn" onClick={() => { setLightboxOpen(true); setCurrentIndex(0); }}>
        <FiGrid style={{ marginRight: '8px' }} /> View All Photos
      </button>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="lg-lightbox" role="dialog" aria-modal="true" onClick={closeLightbox}>
          <button className="lg-close" onClick={closeLightbox} aria-label="Close">
            <FiX size={24} />
          </button>
          
          <button className="lg-prev" onClick={(e) => { e.stopPropagation(); prevImage(); }} aria-label="Previous image">
            <FiChevronLeft size={32} />
          </button>

          <div className="lg-content" onClick={(e) => e.stopPropagation()}>
            <img src={allImages[currentIndex]} alt={`${title} full view ${currentIndex + 1}`} />
            <div className="lg-counter">{currentIndex + 1} / {allImages.length}</div>
          </div>

          <button className="lg-next" onClick={(e) => { e.stopPropagation(); nextImage(); }} aria-label="Next image">
            <FiChevronRight size={32} />
          </button>
        </div>
      )}
    </div>
  );
}
