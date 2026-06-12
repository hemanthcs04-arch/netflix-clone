import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { formatRuntime, formatYear } from '../../utils/constants';
import { getPosterUrl } from '../../api/tmdb';
import './TrailerModal.css';

export default function TrailerModal({ movie, trailerKey, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!movie) return null;

  const title = movie.title || movie.name || movie.original_name;
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;
  let ratingClass = 'rating--green';
  if (rating < 7) ratingClass = 'rating--yellow';
  if (rating < 5) ratingClass = 'rating--red';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose}>
          <FiX />
        </button>
        <div className="modal__video-wrapper">
          {trailerKey ? (
            <iframe
              className="modal__video"
              src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1&origin=${window.location.origin}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="modal__no-video">
              <img src={getPosterUrl(movie.poster_path)} alt={title} />
              <div className="modal__no-video-text">No trailer available</div>
            </div>
          )}
        </div>
        <div className="modal__info">
          <div className="modal__metadata">
            {rating && <span className={`modal__rating ${ratingClass}`}>{rating} Match</span>}
            <span className="modal__year">{formatYear(movie.release_date || movie.first_air_date)}</span>
            {movie.runtime > 0 && <span className="modal__runtime">{formatRuntime(movie.runtime)}</span>}
            <span className="modal__hd">HD</span>
          </div>
          <h2 className="modal__title">{title}</h2>
          <p className="modal__overview">{movie.overview}</p>
        </div>
      </div>
    </div>
  );
}
