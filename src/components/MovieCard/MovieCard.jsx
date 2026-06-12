import React, { useMemo } from 'react';
import { FiPlay, FiPlus, FiCheck, FiThumbsUp } from 'react-icons/fi';
import { getPosterUrl, getBackdropUrl } from '../../api/tmdb';
import useWatchlist from '../../hooks/useWatchlist';
import { formatYear } from '../../utils/constants';
import './MovieCard.css';

export default function MovieCard({ movie, isLargeRow, onClick }) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const matchPercentage = useMemo(() => Math.floor(Math.random() * 30 + 70), []);

  const imagePath = isLargeRow ? movie.poster_path : movie.backdrop_path;
  if (!imagePath) return null;

  const imageUrl = isLargeRow ? getPosterUrl(imagePath) : getBackdropUrl(imagePath);
  const inList = isInWatchlist(movie.id);

  const handleWatchlist = (e) => {
    e.stopPropagation();
    toggleWatchlist(movie);
  };

  return (
    <div className={`card ${isLargeRow ? 'card--large' : ''}`} onClick={onClick}>
      <img
        className="card__image"
        src={imageUrl}
        alt={movie.name || movie.title}
        loading="lazy"
      />
      <div className="card__info">
        <div className="card__icons">
          <div className="card__icons-left">
            <button className="card__btn card__btn--play"><FiPlay /></button>
            <button className="card__btn" onClick={handleWatchlist}>
              {inList ? <FiCheck /> : <FiPlus />}
            </button>
            <button className="card__btn"><FiThumbsUp /></button>
          </div>
        </div>
        <div className="card__metadata">
          <span className="card__match">{matchPercentage}% Match</span>
          <span className="card__year">{formatYear(movie.release_date || movie.first_air_date)}</span>
        </div>
        <div className="card__title">{movie.title || movie.name}</div>
      </div>
    </div>
  );
}
