import { useRef } from 'react';
import MovieCard from './MovieCard';
import './Row.css';

export default function Row({ title, movies, isLarge, onSelect }) {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    const el = rowRef.current;
    if (!el) return;
    const amount = direction === 'left' ? -el.clientWidth * 0.8 : el.clientWidth * 0.8;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  if (!movies?.length) return null;

  return (
    <section className="row">
      <h2 className="row__title">{title}</h2>
      <div className="row__wrapper">
        <button
          type="button"
          className="row__arrow row__arrow--left"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          ‹
        </button>
        <div className="row__posters" ref={rowRef}>
          {movies.map((movie) => (
            <MovieCard
              key={`${movie.id}-${movie.media_type ?? 'movie'}`}
              movie={movie}
              isLarge={isLarge}
              onSelect={onSelect}
            />
          ))}
        </div>
        <button
          type="button"
          className="row__arrow row__arrow--right"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>
    </section>
  );
}
