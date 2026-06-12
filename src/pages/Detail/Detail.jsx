import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlay, FiPlus, FiCheck } from 'react-icons/fi';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import TrailerModal from '../../components/TrailerModal/TrailerModal';
import { fetchMovieDetail, fetchTVDetail, pickTrailerKey, getBackdropUrl, getProfileUrl, getPosterUrl } from '../../api/tmdb';
import useWatchlist from '../../hooks/useWatchlist';
import { formatRuntime, formatYear } from '../../utils/constants';
import './Detail.css';

export default function Detail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);

  const isTv = location.pathname.includes('/tv/');

  useEffect(() => {
    async function loadDetail() {
      setLoading(true);
      try {
        const data = isTv ? await fetchTVDetail(id) : await fetchMovieDetail(id);
        setDetail(data);
        const key = pickTrailerKey(data.videos);
        setTrailerKey(key);
      } catch (error) {
        console.error("Error loading detail:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [id, isTv]);

  if (loading) {
    return (
      <div className="detail">
        <Navbar />
        <div className="loading-spinner"><div className="loading-spinner__circle"></div></div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="detail">
        <Navbar />
        <div className="detail__error">Content not found.</div>
      </div>
    );
  }

  const title = detail.title || detail.name;
  const rating = detail.vote_average ? detail.vote_average.toFixed(1) : null;
  const inList = isInWatchlist(detail.id);
  const backdropUrl = getBackdropUrl(detail.backdrop_path || detail.poster_path);

  return (
    <div className="detail">
      <Navbar />
      
      <div className="detail__hero" style={{ backgroundImage: `url(${backdropUrl})` }}>
        <div className="detail__hero-overlay"></div>
        <button className="detail__back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        
        <div className="detail__content">
          <h1 className="detail__title">{title}</h1>
          {detail.tagline && <p className="detail__tagline">{detail.tagline}</p>}
          
          <div className="detail__meta">
            {rating && <span className="detail__rating">{rating} Match</span>}
            <span>{formatYear(detail.release_date || detail.first_air_date)}</span>
            {detail.runtime > 0 && <span>{formatRuntime(detail.runtime)}</span>}
            {detail.number_of_seasons && <span>{detail.number_of_seasons} Season{detail.number_of_seasons > 1 ? 's' : ''}</span>}
            <span className="detail__hd">HD</span>
          </div>

          <div className="detail__genres">
            {detail.genres?.map(g => <span key={g.id} className="detail__genre-tag">{g.name}</span>)}
          </div>

          <div className="detail__actions">
            <button className="detail__btn detail__btn--play" onClick={() => setShowTrailer(true)}>
              <FiPlay /> Play Trailer
            </button>
            <button className="detail__btn detail__btn--list" onClick={() => toggleWatchlist(detail)}>
              {inList ? <FiCheck /> : <FiPlus />} {inList ? 'My List' : 'My List'}
            </button>
          </div>

          <p className="detail__overview">{detail.overview}</p>
        </div>
      </div>

      <div className="detail__body">
        {detail.credits?.cast?.length > 0 && (
          <div className="detail__section">
            <h2>Cast</h2>
            <div className="detail__cast-scroll">
              {detail.credits.cast.slice(0, 15).map(person => (
                <div key={person.id} className="detail__cast-card">
                  <div className="detail__cast-photo">
                    {person.profile_path ? (
                      <img src={getProfileUrl(person.profile_path)} alt={person.name} />
                    ) : (
                      <div className="detail__cast-placeholder">{person.name.charAt(0)}</div>
                    )}
                  </div>
                  <div className="detail__cast-name">{person.name}</div>
                  <div className="detail__cast-role">{person.character}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {detail.similar?.results?.length > 0 && (
          <div className="detail__section">
            <h2>More Like This</h2>
            <div className="detail__similar-grid">
              {detail.similar.results.slice(0, 12).map(item => (
                <div key={item.id} className="detail__similar-card" onClick={() => navigate(`/${item.media_type || (isTv ? 'tv' : 'movie')}/${item.id}`)}>
                  <img src={getPosterUrl(item.poster_path || item.backdrop_path)} alt={item.title || item.name} />
                  <div className="detail__similar-title">{item.title || item.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />

      {showTrailer && (
        <TrailerModal 
          movie={detail} 
          trailerKey={trailerKey} 
          onClose={() => setShowTrailer(false)} 
        />
      )}
    </div>
  );
}
