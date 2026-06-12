import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlay, FiInfo } from 'react-icons/fi';
import { getBackdropUrl } from '../../api/tmdb';
import { truncateText } from '../../utils/constants';
import './HeroBanner.css';

export default function HeroBanner({ movie, onPlay }) {
  const navigate = useNavigate();

  if (!movie) return null;

  const handleMoreInfo = () => {
    const isTv = movie.media_type === 'tv' || movie.first_air_date;
    navigate(`/${isTv ? 'tv' : 'movie'}/${movie.id}`);
  };

  const backdropUrl = getBackdropUrl(movie.backdrop_path || movie.poster_path);
  const title = movie.title || movie.name || movie.original_name;
  const overview = truncateText(movie.overview, 150);

  return (
    <div 
      className="hero"
      style={{
        backgroundImage: `url(${backdropUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center'
      }}
    >
      <div className="hero__overlay-left"></div>
      <div className="hero__content">
        <h1 className="hero__title">{title}</h1>
        <p className="hero__overview">{overview}</p>
        <div className="hero__buttons">
          <button className="hero__button hero__button--play" onClick={() => onPlay(movie)}>
            <FiPlay /> Play
          </button>
          <button className="hero__button hero__button--more" onClick={handleMoreInfo}>
            <FiInfo /> More Info
          </button>
        </div>
      </div>
      <div className="hero__overlay-bottom"></div>
    </div>
  );
}
