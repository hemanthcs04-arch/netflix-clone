import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <img src="/netflux-logo.png" alt="" width="28" height="28" />
          <span>NETFLUX</span>
        </div>
        <p className="footer__tagline">Movies &amp; TV — stream trailers instantly.</p>
        <p className="footer__credit">
          Data &amp; images from{' '}
          <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
            TMDB
          </a>
          . Trailers via YouTube.
        </p>
        <p className="footer__copy">&copy; {new Date().getFullYear()} Netflux</p>
      </div>
    </footer>
  );
}
