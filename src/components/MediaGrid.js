import React from 'react';

const MediaGrid = ({ images }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="media-grid">
      {images.map((image, index) => (
        <div key={index} className="media-item">
          <img
            src={image.url}
            alt={image.alt || 'Search result image'}
            className="media-image"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
};

export default MediaGrid;
