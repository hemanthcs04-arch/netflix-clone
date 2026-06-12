import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { searchMulti, getPosterUrl } from '../../api/tmdb';
import { formatYear } from '../../utils/constants';
import './Search.css';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const navigate = useNavigate();
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'movie', 'tv'

  useEffect(() => {
    async function doSearch() {
      if (!query) return;
      setLoading(true);
      try {
        const data = await searchMulti(query);
        setResults(data || []);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }
    doSearch();
  }, [query]);

  const filteredResults = results.filter(item => {
    if (filter === 'all') return true;
    return item.media_type === filter;
  });

  return (
    <div className="search-page">
      <Navbar />
      
      <div className="search-page__content">
        <h1 className="search-page__title">Results for "{query}"</h1>
        
        <div className="search-page__filters">
          <button 
            className={`search-page__filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`search-page__filter-btn ${filter === 'movie' ? 'active' : ''}`}
            onClick={() => setFilter('movie')}
          >
            Movies
          </button>
          <button 
            className={`search-page__filter-btn ${filter === 'tv' ? 'active' : ''}`}
            onClick={() => setFilter('tv')}
          >
            TV Shows
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="loading-spinner__circle"></div></div>
        ) : filteredResults.length > 0 ? (
          <div className="search-page__grid">
            {filteredResults.map(item => (
              <div 
                key={item.id} 
                className="search-page__card"
                onClick={() => navigate(`/${item.media_type}/${item.id}`)}
              >
                {item.poster_path ? (
                  <img src={getPosterUrl(item.poster_path)} alt={item.title || item.name} />
                ) : (
                  <div className="search-page__no-image">{item.title || item.name}</div>
                )}
                <div className="search-page__card-info">
                  <div className="search-page__card-title">{item.title || item.name}</div>
                  <div className="search-page__card-year">
                    {formatYear(item.release_date || item.first_air_date)} • {item.media_type === 'movie' ? 'Movie' : 'TV'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="search-page__empty">
            <p>No results found for "{query}".</p>
            <p className="search-page__suggestions">Try searching for a different movie, TV show, or person.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
