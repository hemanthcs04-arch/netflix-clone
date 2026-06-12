import React, { useState, useEffect, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import MovieCard from '../MovieCard/MovieCard';
import { SkeletonRow } from '../Skeleton/Skeleton';
import './MovieRow.css';

export default function MovieRow({ title, fetchData, isLargeRow, onMovieClick }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const rowRef = useRef(null);

  useEffect(() => {
    async function loadMovies() {
      try {
        const data = await fetchData();
        setMovies(data || []);
      } catch (error) {
        console.error(`Failed to fetch ${title}:`, error);
      } finally {
        setLoading(false);
      }
    }
    loadMovies();
  }, [fetchData, title]);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (loading) {
    return <SkeletonRow isLargeRow={isLargeRow} />;
  }

  if (movies.length === 0) return null;

  return (
    <div className="row">
      <h2 className="row__title">{title}</h2>
      <div className="row__container">
        <button className="row__arrow row__arrow--left" onClick={() => handleScroll('left')}>
          <FiChevronLeft />
        </button>
        <div className="row__posters" ref={rowRef}>
          {movies.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              isLargeRow={isLargeRow} 
              onClick={() => onMovieClick && onMovieClick(movie)} 
            />
          ))}
        </div>
        <button className="row__arrow row__arrow--right" onClick={() => handleScroll('right')}>
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}
