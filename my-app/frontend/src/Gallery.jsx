import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './GalleryPage.css';

const GalleryPage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [allImages, setAllImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({});

  const API_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL || 'https://leemaraj-cottage.onrender.com';

  useEffect(() => {
    fetchGalleryData();
  }, []);

  const fetchGalleryData = async () => {
    setLoading(true);
    try {
      // Fetch all images
      const response = await axios.get(`${API_BASE_URL}/api/gallery/images`);
      if (response.data.success) {
        setAllImages(response.data.images);
        setCategories(['all', ...response.data.categories]);
      }
      
      // Fetch stats
      const statsResponse = await axios.get(`${API_BASE_URL}/api/gallery/stats`);
      if (statsResponse.data.success) {
        setStats(statsResponse.data);
      }
      
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = activeCategory === 'all' 
    ? allImages 
    : allImages.filter(img => img.category === activeCategory);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading {stats.total_images || 'all'} beautiful spaces...</p>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      <div className="gallery-page-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <h1>Complete Gallery</h1>
        <p>Explore all {stats.total_images} beautiful spaces at Leemaraj Cottage</p>
        <div className="photo-stats">
          <span className="stat-badge">📸 Total: {stats.total_images} Photos</span>
          {Object.keys(stats.categories || {}).map(cat => (
            <span key={cat} className="stat-badge">
              🏷️ {cat}: {stats.categories[cat]}
            </span>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        {categories.map(category => (
          <button
            key={category}
            className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category === 'all' ? 'All Photos' : category}
            {category !== 'all' && (
              <span className="count-badge">
                ({allImages.filter(img => img.category === category).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="full-gallery-grid">
        {filteredImages.map((image, index) => (
          <div 
            className="gallery-card" 
            key={image.id}
            onClick={() => setSelectedImage(image)}
          >
            <div className="gallery-card-image">
              <img 
                src={image.image_url?.startsWith("http") ? image.image_url : `${API_BASE_URL}${image.image_url}`} 
                alt={image.title}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=Image+Loading';
                }}
              />
              <div className="card-overlay">
                <span className="view-icon">🔍</span>
                <span>View Details</span>
              </div>
              <div className="category-badge">{image.category}</div>
              {image.price !== 'Included' && image.price !== 'Common Area' && image.price !== 'Free Access' && (
                <div className="price-tag">{image.price}</div>
              )}
            </div>
            <div className="gallery-card-info">
              <h3>{image.title}</h3>
              <div className="card-stats">
                <span>📏 {image.size}</span>
                <span>👥 {image.capacity}</span>
              </div>
              <p className="short-desc">{image.description.substring(0, 80)}...</p>
              <div className="card-features">
                {image.features.slice(0, 3).map((feature, idx) => (
                  <span key={idx} className="feature-chip">✓ {feature}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="full-lightbox" onClick={() => setSelectedImage(null)}>
          <div className="full-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close-btn" onClick={() => setSelectedImage(null)}>✕</button>
            
            <div className="lightbox-layout">
              <div className="lightbox-image">
                <img src={selectedImage.image_url?.startsWith("http") ? selectedImage.image_url : `${API_BASE_URL}${selectedImage.image_url}`} alt={selectedImage.title} />
              </div>
              
              <div className="lightbox-info">
                <h2>{selectedImage.title}</h2>
                <span className="info-category">{selectedImage.category}</span>
                
                <div className="info-section">
                  <h3>📝 Description</h3>
                  <p>{selectedImage.description}</p>
                </div>
                
                <div className="info-section">
                  <h3>✨ Key Features</h3>
                  <div className="features-list">
                    {selectedImage.features.map((feature, idx) => (
                      <span key={idx} className="feature-item">✓ {feature}</span>
                    ))}
                  </div>
                </div>
                
                <div className="info-stats">
                  <div className="stat">
                    <span className="stat-label">Area</span>
                    <span className="stat-value">{selectedImage.size}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Capacity</span>
                    <span className="stat-value">{selectedImage.capacity}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Price</span>
                    <span className="stat-value">{selectedImage.price}</span>
                  </div>
                </div>
                
                <button className="book-now-btn" onClick={() => navigate('/rooms')}>
                  Book This Space →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;