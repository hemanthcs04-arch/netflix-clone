import { useCallback, useEffect, useState } from 'react';
import { fetchCategoryRows, hasApiKey, searchMovies } from '../api/tmdb';
import { movieCategories, tvCategories } from '../utils/requests';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import Row from '../components/Row';
import Modal from '../components/Modal';
import Footer from '../components/Footer';
import './Index.css';

async function loadCategoryList(categories) {
  const settled = await Promise.allSettled(
    categories.map(async (cat) => ({
      ...cat,
      movies: await fetchCategoryRows(cat.endpoint, cat.mediaType),
    }))
  );

  return settled.map((result, i) => {
    if (result.status === 'fulfilled') return result.value;
    console.warn(`Row failed: ${categories[i].title}`, result.reason);
    return { ...categories[i], movies: [] };
  });
}

function ContentSection({ id, title, rows, onSelect, largeFirstRow }) {
  const visible = rows.filter((row) => row.movies.length > 0);
  if (!visible.length) return null;

  return (
    <section id={id} className="content-section" aria-label={title}>
      {title && <h2 className="content-section__title">{title}</h2>}
      {visible.map((row, i) => (
        <Row
          key={row.title}
          title={row.title}
          movies={row.movies}
          isLarge={largeFirstRow && i === 0}
          onSelect={onSelect}
        />
      ))}
    </section>
  );
}

function PageShell({ children }) {
  return <div className="index-page">{children}</div>;
}

function LoadingScreen() {
  return (
    <PageShell>
      <div className="index-page__centered">
        <img
          src="/netflux-logo.png"
          alt="Netflux"
          className="index-page__symbol"
          width="72"
          height="72"
        />
        <span className="index-page__brand">NETFLUX</span>
        <p>Loading movies &amp; series…</p>
      </div>
    </PageShell>
  );
}

function ErrorScreen({ title, children }) {
  return (
    <PageShell>
      <div className="index-page__centered index-page__centered--error">
        <img src="/netflux-logo.png" alt="" width="56" height="56" />
        <h1>{title}</h1>
        {children}
      </div>
    </PageShell>
  );
}

/** Main index page — navbar, banner, movies, TV, search, trailers, footer */
export default function Index() {
  const [activeView, setActiveView] = useState('home');
  const [featured, setFeatured] = useState(null);
  const [movieRows, setMovieRows] = useState([]);
  const [tvRows, setTvRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function load() {
      if (!hasApiKey()) {
        setError('MISSING_API_KEY');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [movies, series] = await Promise.all([
          loadCategoryList(movieCategories),
          loadCategoryList(tvCategories),
        ]);

        const hasContent =
          movies.some((r) => r.movies.length > 0) || series.some((r) => r.movies.length > 0);

        if (!hasContent) {
          setError('Could not load content. Check your API key and internet connection.');
          return;
        }

        setMovieRows(movies);
        setTvRows(series);

        const trendingMovies = movies[0]?.movies ?? [];
        const pick =
          trendingMovies[Math.floor(Math.random() * Math.min(trendingMovies.length, 10))] ??
          trendingMovies[0];
        setFeatured(pick ?? null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const navigate = useCallback((view) => {
    setActiveView(view);
    setSearchResults(null);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openTitle = useCallback((item) => {
    setSelected(item);
  }, []);

  const closeModal = () => setSelected(null);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults(null);
      setSearchQuery('');
      return;
    }
    try {
      const results = await searchMovies(query);
      setSearchQuery(query);
      setSearchResults(results);
      setActiveView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message);
    }
  };

  const searchMovieRows =
    searchResults?.filter((item) => item.media_type === 'movie') ?? [];
  const searchTvRows = searchResults?.filter((item) => item.media_type === 'tv') ?? [];

  const showMovies =
    !searchResults && (activeView === 'home' || activeView === 'movies');
  const showTv = !searchResults && (activeView === 'home' || activeView === 'tv');
  const showBanner = !searchResults && activeView === 'home' && featured;

  const showSearchMovies = searchResults && searchMovieRows.length > 0;
  const showSearchTv = searchResults && searchTvRows.length > 0;

  if (loading) return <LoadingScreen />;

  if (error === 'MISSING_API_KEY') {
    return (
      <ErrorScreen title="API key required">
        <p>Add your TMDB access token to <code>.env</code> and restart the server.</p>
        <ol className="index-page__steps">
          <li>
            <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer">
              Get token at TMDB Settings → API
            </a>
          </li>
          <li>
            Set <code>VITE_TMDB_ACCESS_TOKEN=your_token</code> in <code>.env</code>
          </li>
          <li>
            Run <code>npm run dev</code>
          </li>
        </ol>
      </ErrorScreen>
    );
  }

  if (error) {
    return (
      <ErrorScreen title="Something went wrong">
        <p>{error}</p>
      </ErrorScreen>
    );
  }

  return (
    <PageShell>
      <Navbar activeView={activeView} onNavigate={navigate} onSearch={handleSearch} />

      {showBanner && (
        <header id="home" className="index-page__hero">
          <Banner
            movie={featured}
            onPlay={() => openTitle(featured)}
            onInfo={() => openTitle(featured)}
          />
        </header>
      )}

      <main
        className={`index-page__main ${showBanner ? '' : 'index-page__main--no-hero'}`}
      >
        {searchResults && (
          <p className="content-section__search-label">
            Search results for &ldquo;{searchQuery}&rdquo;
          </p>
        )}

        {showSearchMovies && (
          <ContentSection
            id="movies"
            title="Movies"
            rows={[{ title: 'Results', movies: searchMovieRows }]}
            onSelect={openTitle}
            largeFirstRow
          />
        )}

        {showSearchTv && (
          <ContentSection
            id="tv-shows"
            title="TV Series"
            rows={[{ title: 'Results', movies: searchTvRows }]}
            onSelect={openTitle}
            largeFirstRow={!showSearchMovies}
          />
        )}

        {searchResults && !showSearchMovies && !showSearchTv && (
          <p className="content-section__empty">No results found.</p>
        )}

        {showMovies && (
          <ContentSection
            id="movies"
            title="Movies"
            rows={movieRows}
            onSelect={openTitle}
            largeFirstRow
          />
        )}

        {showTv && (
          <ContentSection
            id="tv-shows"
            title="TV Series"
            rows={tvRows}
            onSelect={openTitle}
            largeFirstRow={activeView === 'tv'}
          />
        )}
      </main>

      <Footer />

      {selected && (
        <Modal
          key={`${selected.media_type ?? 'movie'}-${selected.id}`}
          movie={selected}
          onClose={closeModal}
        />
      )}
    </PageShell>
  );
}
