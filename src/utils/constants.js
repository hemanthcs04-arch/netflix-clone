export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/original';
export const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w500';
export const TMDB_PROFILE_BASE = 'https://image.tmdb.org/t/p/w185';

export const GENRE_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

export function formatRuntime(minutes) {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function formatYear(dateString) {
  if (!dateString) return '';
  return dateString.substring(0, 4);
}

export function truncateText(text, maxLen = 200) {
  if (!text) return '';
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen).trim() + '...';
}
