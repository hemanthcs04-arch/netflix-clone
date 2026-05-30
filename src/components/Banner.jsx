import { getImageUrl } from '../api/tmdb';
import './Banner.css';

export default function Banner({ movie, onPlay, onInfo }) {
  if (!movie) {
    return (
      <section className="banner banner--loading">
        <div className="banner__shimmer" />
      </section>
    );
  }

  const title = movie.title || movie.name;
  const backdrop = getImageUrl(movie.backdrop_path);
  const description =
    movie.overview?.length > 200
      ? `${movie.overview.slice(0, 200)}…`
      : movie.overview;

  return (
    <section
      className="banner"
      id="home"
      style={backdrop ? { backgroundImage: `url(${backdrop})` } : undefined}
    >
      <div className="banner__fade-bottom" />
      <div className="banner__content">
        <h1 className="banner__title">{title}</h1>
        <p className="banner__description">{description}</p>
        <div className="banner__buttons">
          <button type="button" className="banner__btn banner__btn--play" onClick={onPlay}>
            ▶ Play
          </button>
          <button type="button" className="banner__btn banner__btn--info" onClick={onInfo}>
            ℹ More Info
          </button>
        </div>
      </div>
    </section>
  );
}
