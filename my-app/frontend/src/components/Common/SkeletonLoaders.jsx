import React from 'react';
import './SkeletonLoaders.css';

export const SkeletonCard = ({ height = '300px' }) => (
  <div className="skeleton skeleton-card" style={{ height }}>
    <div className="skeleton-img"></div>
    <div className="skeleton-content">
      <div className="skeleton-title"></div>
      <div className="skeleton-text w-75"></div>
      <div className="skeleton-text w-50"></div>
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 3, height = '300px', columns = 3 }) => {
  return (
    <div className={`grid-${columns}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} height={height} />
      ))}
    </div>
  );
};

export const SkeletonText = ({ lines = 3 }) => (
  <div className="skeleton-text-block">
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className={`skeleton-line w-${100 - (i * 10)}`}></div>
    ))}
  </div>
);

export const SkeletonHero = () => (
  <div className="skeleton-hero">
    <div className="skeleton-hero-content">
      <div className="skeleton-title hero-title"></div>
      <div className="skeleton-text hero-text"></div>
    </div>
  </div>
);

export const SkeletonRoomDetails = () => (
  <div className="skeleton-room-details">
    <div className="skeleton-gallery">
      <div className="skeleton-main-img"></div>
      <div className="skeleton-thumbs">
        <div className="skeleton-thumb"></div>
        <div className="skeleton-thumb"></div>
        <div className="skeleton-thumb"></div>
        <div className="skeleton-thumb"></div>
      </div>
    </div>
    <div className="skeleton-info-grid mt-8">
      <div className="skeleton-info-main">
        <SkeletonText lines={5} />
      </div>
      <div className="skeleton-info-sidebar">
        <div className="skeleton-box" style={{ height: '300px' }}></div>
      </div>
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4 }) => (
  <div className="skeleton-table" style={{ background: '#fff', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)', boxShadow: 'var(--shadow-sm)' }}>
    <div className="skeleton-header-row" style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '16px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
      {Array.from({ length: columns }).map((_, i) => (
        <div key={i} className="skeleton-text" style={{ width: '60%', margin: 0, height: '20px' }}></div>
      ))}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="skeleton-row" style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '16px', padding: '12px 0', borderBottom: '1px solid var(--color-soft)' }}>
        {Array.from({ length: columns }).map((_, j) => (
          <div key={j} className="skeleton-text" style={{ width: `${Math.random() * 40 + 40}%`, margin: 0 }}></div>
        ))}
      </div>
    ))}
  </div>
);
