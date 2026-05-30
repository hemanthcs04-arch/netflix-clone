import { useCallback, useEffect, useRef, useState } from 'react';
import {
  fetchEpisodeVideos,
  fetchMovieWithVideos,
  fetchTvDetails,
  fetchTvSeason,
  getImageUrl,
  isTvShow,
  pickTrailerKey,
} from '../api/tmdb';
import { searchTrailer } from '../api/youtube';
import YoutubePlayer from './YoutubePlayer';
import './Modal.css';

export default function Modal({ movie, onClose }) {
  const [trailerId, setTrailerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const loadGenRef = useRef(0);

  const isTv = isTvShow(movie);
  const title = movie.title || movie.name;
  const year = (movie.release_date || movie.first_air_date || '').slice(0, 4);
  const poster = getImageUrl(movie.backdrop_path || movie.poster_path);

  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [seasonNum, setSeasonNum] = useState(1);
  const [episodeNum, setEpisodeNum] = useState(1);

  const isStale = (gen) => gen !== loadGenRef.current;

  const stopAllPlayback = useCallback(() => {
    loadGenRef.current += 1;
    setTrailerId(null);
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      stopAllPlayback();
    };
  }, [onClose, stopAllPlayback]);

  const loadMovieVideo = useCallback(async () => {
    const gen = ++loadGenRef.current;
    setLoading(true);
    setTrailerId(null);

    try {
      const details = await fetchMovieWithVideos(movie.id, 'movie');
      if (isStale(gen)) return;

      let key = pickTrailerKey(details.videos?.results ?? []);
      if (!key) key = await searchTrailer(title, year);
      if (isStale(gen)) return;

      setTrailerId(key);
    } catch {
      if (!isStale(gen)) setTrailerId(null);
    } finally {
      if (!isStale(gen)) setLoading(false);
    }
  }, [movie.id, title, year]);

  const loadEpisodeVideo = useCallback(
    async (season, episode) => {
      const gen = ++loadGenRef.current;
      setLoading(true);
      setTrailerId(null);

      try {
        const videos = await fetchEpisodeVideos(movie.id, season, episode);
        if (isStale(gen)) return;

        let key = pickTrailerKey(videos);
        if (!key) key = await searchTrailer(`${title} S${season}E${episode}`, year);
        if (isStale(gen)) return;

        setTrailerId(key);
      } catch {
        if (!isStale(gen)) setTrailerId(null);
      } finally {
        if (!isStale(gen)) setLoading(false);
      }
    },
    [movie.id, title, year]
  );

  const loadSeasonEpisodes = useCallback(
    async (season, parentGen) => {
      const gen = parentGen ?? ++loadGenRef.current;
      setLoading(true);
      setTrailerId(null);

      try {
        const data = await fetchTvSeason(movie.id, season);
        if (isStale(gen)) return;

        const list = (data.episodes ?? []).filter((ep) => ep.episode_number > 0);
        setEpisodes(list);
        const first = list[0]?.episode_number ?? 1;
        setEpisodeNum(first);

        const videos = await fetchEpisodeVideos(movie.id, season, first);
        if (isStale(gen)) return;

        let key = pickTrailerKey(videos);
        if (!key) key = await searchTrailer(`${title} S${season}E${first}`, year);
        if (isStale(gen)) return;

        setTrailerId(key);
      } catch {
        if (!isStale(gen)) {
          setEpisodes([]);
          setTrailerId(null);
        }
      } finally {
        if (!isStale(gen)) setLoading(false);
      }
    },
    [movie.id, title, year]
  );

  const initTvShow = useCallback(async () => {
    const gen = ++loadGenRef.current;
    setLoading(true);
    setTrailerId(null);

    try {
      const details = await fetchTvDetails(movie.id);
      if (isStale(gen)) return;

      const seasonList = (details.seasons ?? []).filter(
        (s) => s.season_number > 0 && (s.episode_count ?? 0) > 0
      );
      setSeasons(seasonList);

      const firstSeason = seasonList[0]?.season_number ?? 1;
      setSeasonNum(firstSeason);
      await loadSeasonEpisodes(firstSeason, gen);
    } catch {
      if (!isStale(gen)) {
        setSeasons([]);
        setLoading(false);
      }
    }
  }, [movie.id, loadSeasonEpisodes]);

  useEffect(() => {
    if (isTv) initTvShow();
    else loadMovieVideo();
  }, [isTv, initTvShow, loadMovieVideo]);

  const handleSeasonChange = (e) => {
    const season = Number(e.target.value);
    setSeasonNum(season);
    loadSeasonEpisodes(season);
  };

  const handleEpisodeClick = (episode) => {
    setEpisodeNum(episode);
    loadEpisodeVideo(seasonNum, episode);
  };

  const handleClose = () => {
    stopAllPlayback();
    onClose();
  };

  if (!movie) return null;

  const currentEpisode = episodes.find((ep) => ep.episode_number === episodeNum);
  const playerKey = `${movie.id}-s${seasonNum}-e${episodeNum}-${trailerId ?? 'none'}`;

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="modal__backdrop" onClick={handleClose} aria-label="Close" />
      <div className="modal__panel">
        <button type="button" className="modal__close" onClick={handleClose}>
          ×
        </button>

        <div className="modal__video-wrap">
          {loading && (
            <p className="modal__loading">
              {isTv ? 'Loading episode preview…' : 'Loading trailer…'}
            </p>
          )}
          {!loading && trailerId && (
            <YoutubePlayer
              key={playerKey}
              videoId={trailerId}
              title={isTv ? `${title} S${seasonNum}E${episodeNum}` : `${title} trailer`}
            />
          )}
          {!loading && !trailerId && (
            <div
              className="modal__no-trailer"
              style={poster ? { backgroundImage: `url(${poster})` } : undefined}
            >
              <p>{isTv ? 'No preview for this episode' : 'No trailer available'}</p>
            </div>
          )}
        </div>

        {isTv && seasons.length > 0 && (
          <div className="modal__tv-controls">
            <label className="modal__season-label">
              Season
              <select value={seasonNum} onChange={handleSeasonChange}>
                {seasons.map((s) => (
                  <option key={s.id} value={s.season_number}>
                    {s.name || `Season ${s.season_number}`}
                  </option>
                ))}
              </select>
            </label>

            <div className="modal__episodes">
              <p className="modal__episodes-title">Episodes</p>
              <ul className="modal__episode-list">
                {episodes.map((ep) => (
                  <li key={ep.id}>
                    <button
                      type="button"
                      className={`modal__episode-btn ${
                        ep.episode_number === episodeNum ? 'modal__episode-btn--active' : ''
                      }`}
                      onClick={() => handleEpisodeClick(ep.episode_number)}
                    >
                      <span className="modal__episode-num">{ep.episode_number}</span>
                      <span className="modal__episode-name">{ep.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {currentEpisode?.overview && (
              <p className="modal__episode-overview">{currentEpisode.overview}</p>
            )}
          </div>
        )}

        <div className="modal__info">
          <h2>{title}</h2>
          <div className="modal__meta">
            {year && <span className="modal__match">98% Match</span>}
            {year && <span>{year}</span>}
            {isTv && seasonNum && episodeNum && (
              <span>
                S{seasonNum} · E{episodeNum}
              </span>
            )}
            <span className="modal__rating">HD</span>
          </div>
          <p>{movie.overview}</p>
        </div>
      </div>
    </div>
  );
}
