import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiBell, FiMenu } from 'react-icons/fi';
import useScrollPosition from '../../hooks/useScrollPosition';
import useAuth from '../../hooks/useAuth';
import './Navbar.css';

export default function Navbar() {
  const isScrolled = useScrollPosition(50);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchClick = () => {
    setSearchOpen(true);
    setTimeout(() => {
      if (searchInputRef.current) searchInputRef.current.focus();
    }, 100);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        <div className="navbar__left">
          <button className="navbar__mobile-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <FiMenu />
          </button>
          <Link to="/" className="navbar__logo">
            NETFLUX
          </Link>
          <ul className={`navbar__links ${isMobileMenuOpen ? 'navbar__links--open' : ''}`}>
            <li><Link to="/browse">Home</Link></li>
            <li><Link to="/browse">TV Shows</Link></li>
            <li><Link to="/browse">Movies</Link></li>
            <li><Link to="/browse">New & Popular</Link></li>
            <li><Link to="/mylist">My List</Link></li>
          </ul>
        </div>

        <div className="navbar__right">
          <form className={`navbar__search ${searchOpen ? 'navbar__search--open' : ''}`} onSubmit={handleSearchSubmit}>
            <button type="button" className="navbar__search-icon" onClick={handleSearchClick}>
              <FiSearch />
            </button>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Titles, people, genres"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => !searchQuery && setSearchOpen(false)}
            />
          </form>
          <div className="navbar__icon">
            <FiBell />
          </div>
          <div className="navbar__profile">
            <div className="navbar__avatar">
              <img src="/netflux-logo.png" alt="Profile" />
            </div>
            <div className="navbar__dropdown">
              <div className="navbar__dropdown-arrow"></div>
              <ul>
                <li>Account</li>
                <li>Help Center</li>
                <li onClick={handleSignOut}>Sign out of Netflix</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
