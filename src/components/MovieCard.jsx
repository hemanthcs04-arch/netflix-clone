import { getImageUrl } from '../api/tmdb';
import './MovieCard.css';

export default function MovieCard({ movie, onSelect, isLarge }) {
  const title = movie.title || movie.name;
  const poster = getImageUrl(movie.poster_path || movie.backdrop_path, 'poster');

  return (
    <article
      className={`movie-card ${isLarge ? 'movie-card--large' : ''}`}
      onClick={() => onSelect(movie)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(movie)}
      role="button"
      tabIndex={0}
      aria-label={`${title} — view details`}
    >
      <div className="movie-card__poster">
        {poster ? (
          <img src={poster} alt="" loading="lazy" />
        ) : (
          <div className="movie-card__placeholder">{title}</div>
        )}
        <div className="movie-card__overlay">
          <span className="movie-card__play">▶</span>
        </div>
      </div>
      <h3 className="movie-card__title">{title}</h3>
    </article>
  );
}
