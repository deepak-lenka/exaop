import React from 'react';
import MediaGrid from './MediaGrid';

const TwitterCard = ({ result }) => {
  if (!result.isTwitter) return null;

  return (
    <div className="twitter-card">
      <div className="twitter-header">
        <svg className="twitter-icon" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        <a href={result.url} target="_blank" rel="noopener noreferrer" className="twitter-link">
          View on X
        </a>
      </div>
      <div className="twitter-content">
        <p className="twitter-text">{result.text}</p>
        {result.images && result.images.length > 0 && (
          <MediaGrid images={result.images} />
        )}
      </div>
      <div className="twitter-footer">
        <span className="twitter-timestamp">{new Date(result.timestamp).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default TwitterCard;
