import React from 'react';
import './Skeleton.css';

export function SkeletonCard({ isLargeRow }) {
  return (
    <div className={`skeleton-card ${isLargeRow ? 'skeleton-card--large' : ''}`}></div>
  );
}

export function SkeletonRow({ isLargeRow }) {
  const cards = Array.from({ length: 7 });
  return (
    <div className="skeleton-row">
      <div className="skeleton-row__title"></div>
      <div className="skeleton-row__posters">
        {cards.map((_, i) => (
          <SkeletonCard key={i} isLargeRow={isLargeRow} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonBanner() {
  return <div className="skeleton-banner"></div>;
}

export default SkeletonRow;
