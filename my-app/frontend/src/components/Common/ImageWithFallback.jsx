import React, { useState } from 'react';

export default function ImageWithFallback({
  src,
  fallbackSrc,
  alt,
  className,
  style,
  ...props
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  const currentSrc = error ? fallbackSrc : src;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...style }} className={className}>
      {loading && currentSrc && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--color-soft)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-muted)',
          zIndex: 1
        }}>
          <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div>
        </div>
      )}
      {currentSrc ? (
        <img
          src={currentSrc}
          alt={alt}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loading ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out'
          }}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      ) : (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--color-soft)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-muted)',
          fontSize: 'var(--text-sm)'
        }}>
          No Image
        </div>
      )}
    </div>
  );
}
