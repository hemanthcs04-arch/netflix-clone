import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiFilm } from 'react-icons/fi';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import useWatchlist from '../../hooks/useWatchlist';
import { getPosterUrl } from '../../api/tmdb';
import { formatYear } from '../../utils/constants';
import './MyList.css';

export default function MyList() {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const navigate = useNavigate();

  return (
    <div className="mylist-page">
      <Navbar />
      
      <div className="mylist-page__content">
        <h1 className="mylist-page__title">My List</h1>
        
        {watchlist.length > 0 ? (
          <div className="mylist-page__grid">
            {watchlist.map(item => (
              <div 
                key={item.id} 
                className="mylist-page__card"
                onClick={() => navigate(`/${item.media_type}/${item.id}`)}
              >
                {item.poster_path ? (
                  <img src={getPosterUrl(item.poster_path)} alt={item.title} />
                ) : (
                  <div className="mylist-page__no-image">{item.title}</div>
                )}
                
                <div className="mylist-page__overlay">
                  <div className="mylist-page__info">
                    <div className="mylist-page__item-title">{item.title}</div>
                    <div className="mylist-page__item-year">
                      {formatYear(item.first_air_date || item.release_date)}
                    </div>
                  </div>
                  <button 
                    className="mylist-page__remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWatchlist(item.id);
                    }}
                  >
                    <FiX />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mylist-page__empty">
            <FiFilm className="mylist-page__empty-icon" />
            <h2>Your list is empty</h2>
            <p>Add movies and TV shows to your list to watch later.</p>
            <button className="mylist-page__browse-btn" onClick={() => navigate('/browse')}>
              Browse Now
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
