import { useEffect, useState } from 'react';
import './Navbar.css';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'movies', label: 'Movies' },
  { id: 'tv', label: 'TV Series' },
];

export default function Navbar({ activeView, onNavigate, onSearch }) {
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__left">
        <button
          type="button"
          className="navbar__brand"
          onClick={() => onNavigate('home')}
          aria-label="Netflux home"
        >
          <img src="/netflux-logo.png" alt="" className="navbar__symbol" width="36" height="36" />
          <span className="navbar__logo-text">NETFLUX</span>
        </button>
        <nav className="navbar__links" aria-label="Main">
          {NAV_ITEMS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`navbar__link ${activeView === id ? 'navbar__link--active' : ''}`}
              onClick={() => onNavigate(id)}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
      <div className="navbar__right">
        <form className="navbar__search" onSubmit={handleSubmit}>
          <input
            type="search"
            placeholder="Search titles…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
          />
        </form>
        <span className="navbar__avatar" title="Profile" />
      </div>
    </header>
  );
}
