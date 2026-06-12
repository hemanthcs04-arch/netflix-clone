import { useState, useEffect, useCallback } from 'react';

const WATCHLIST_KEY = 'netflix_clone_watchlist';

function getStoredWatchlist() {
  try {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export default function useWatchlist() {
  const [watchlist, setWatchlist] = useState(getStoredWatchlist);

  useEffect(() => {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = useCallback((item) => {
    setWatchlist((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) return prev;
      const entry = {
        id: item.id,
        title: item.title || item.name,
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        media_type: item.media_type || (item.first_air_date ? 'tv' : 'movie'),
        vote_average: item.vote_average,
        overview: item.overview,
      };
      return [entry, ...prev];
    });
  }, []);

  const removeFromWatchlist = useCallback((id) => {
    setWatchlist((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const isInWatchlist = useCallback(
    (id) => watchlist.some((item) => item.id === id),
    [watchlist]
  );

  const toggleWatchlist = useCallback(
    (item) => {
      if (isInWatchlist(item.id)) {
        removeFromWatchlist(item.id);
      } else {
        addToWatchlist(item);
      }
    },
    [isInWatchlist, addToWatchlist, removeFromWatchlist]
  );

  return { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist, toggleWatchlist };
}
