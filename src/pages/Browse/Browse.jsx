import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import HeroBanner from '../../components/HeroBanner/HeroBanner';
import MovieRow from '../../components/MovieRow/MovieRow';
import TrailerModal from '../../components/TrailerModal/TrailerModal';
import Footer from '../../components/Footer/Footer';
import { SkeletonBanner, SkeletonRow } from '../../components/Skeleton/Skeleton';
import { 
  fetchTrending, 
  fetchNetflixOriginals, 
  fetchMovieDetail, 
  fetchTVDetail, 
  pickTrailerKey, 
  MOVIE_ROWS, 
  TV_ROWS 
} from '../../api/tmdb';

export default function Browse() {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const movies = await fetchTrending();
        if (movies && movies.length > 0) {
          const randomIndex = Math.floor(Math.random() * Math.min(movies.length, 10));
          setFeaturedMovie(movies[randomIndex]);
        }
      } catch (error) {
        console.error("Error loading featured movie:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const handlePlay = async (movie) => {
    try {
      setSelectedMovie(movie);
      setShowTrailer(true);
      const isTv = movie.media_type === 'tv' || movie.first_air_date;
      const detail = isTv ? await fetchTVDetail(movie.id) : await fetchMovieDetail(movie.id);
      const key = pickTrailerKey(detail.videos);
      setTrailerKey(key);
    } catch (error) {
      console.error("Error fetching trailer:", error);
      setTrailerKey(null);
    }
  };

  const closeTrailer = () => {
    setShowTrailer(false);
    setSelectedMovie(null);
    setTrailerKey(null);
  };

  return (
    <div className="browse">
      <Navbar />
      
      {isLoading ? (
        <SkeletonBanner />
      ) : (
        <HeroBanner movie={featuredMovie} onPlay={handlePlay} />
      )}

      <div className="browse__content">
        <MovieRow 
          title="NETFLUX ORIGINALS" 
          fetchData={fetchNetflixOriginals} 
          isLargeRow={true} 
          onMovieClick={handlePlay} 
        />
        
        {MOVIE_ROWS.map((row, index) => (
          <MovieRow 
            key={`movie-${index}`} 
            title={row.title} 
            fetchData={row.fetcher} 
            onMovieClick={handlePlay} 
          />
        ))}

        {TV_ROWS.map((row, index) => (
          <MovieRow 
            key={`tv-${index}`} 
            title={row.title} 
            fetchData={row.fetcher} 
            onMovieClick={handlePlay} 
          />
        ))}
      </div>

      <Footer />

      {showTrailer && selectedMovie && (
        <TrailerModal 
          movie={selectedMovie} 
          trailerKey={trailerKey} 
          onClose={closeTrailer} 
        />
      )}
    </div>
  );
}
