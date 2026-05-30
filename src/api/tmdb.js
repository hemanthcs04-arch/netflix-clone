const TMDB_BASE = 'https://api.themoviedb.org/3';
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const IMAGE_BASE = 'https://image.tmdb.org/t/p/original';
export const POSTER_BASE = 'https://image.tmdb.org/t/p/w500';

const PLACEHOLDERS = new Set([
  'your_tmdb_api_key_here',
  'your_access_token_here',
  'paste_your_access_token_here',
  'PASTE_YOUR_ACCESS_TOKEN_HERE',
  '<<access_token>>',
  '',
]);

function buildUrl(endpoint, params = {}) {
  const [path, queryString] = endpoint.split('?');
  const search = new URLSearchParams(queryString ?? '');
  search.set('language', 'en-US');

  // v3 API key auth (optional if using Bearer token)
  if (API_KEY && !PLACEHOLDERS.has(API_KEY)) {
    search.set('api_key', API_KEY);
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== '') search.set(key, value);
  });

  return `${TMDB_BASE}${path}?${search}`;
}

function authHeaders() {
  if (ACCESS_TOKEN && !PLACEHOLDERS.has(ACCESS_TOKEN)) {
    return { Authorization: `Bearer ${ACCESS_TOKEN}` };
  }
  return {};
}

export function hasApiKey() {
  const hasToken = ACCESS_TOKEN && !PLACEHOLDERS.has(ACCESS_TOKEN);
  const hasKey = API_KEY && !PLACEHOLDERS.has(API_KEY);
  return Boolean(hasToken || hasKey);
}

async function tmdbFetch(endpoint, params = {}) {
  if (!hasApiKey()) {
    throw new Error('MISSING_API_KEY');
  }

  const res = await fetch(buildUrl(endpoint, params), {
    headers: {
      accept: 'application/json',
      ...authHeaders(),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = body.status_message || res.statusText;
    if (res.status === 401) {
      throw new Error(
        'Invalid TMDB credentials. Check VITE_TMDB_ACCESS_TOKEN in your .env file.'
      );
    }
    throw new Error(`TMDB error (${res.status}): ${msg}`);
  }

  return res.json();
}

export function getImageUrl(path, size = 'original') {
  if (!path) return null;
  const base = size === 'poster' ? POSTER_BASE : IMAGE_BASE;
  return `${base}${path}`;
}

export async function fetchMovies(endpoint) {
  const data = await tmdbFetch(endpoint);
  return data.results ?? [];
}

/** Keep only items matching mediaType; tag each item for modal/routing */
export function filterByMediaType(items, mediaType) {
  return items
    .filter((item) => !item.media_type || item.media_type === mediaType)
    .map((item) => ({ ...item, media_type: mediaType }));
}

export async function fetchCategoryRows(endpoint, mediaType) {
  const items = await fetchMovies(endpoint);
  return filterByMediaType(items, mediaType);
}

/** Same as: GET /movie/{id}?append_to_response=videos + Bearer token */
export async function fetchMovieWithVideos(movieId, mediaType = 'movie') {
  return tmdbFetch(`/${mediaType}/${movieId}`, {
    append_to_response: 'videos',
  });
}

export async function fetchVideos(movieId, mediaType = 'movie') {
  const data = await fetchMovieWithVideos(movieId, mediaType);
  return data.videos?.results ?? [];
}

export function pickTrailerKey(videos, types = ['Trailer', 'Teaser', 'Clip', 'Featurette']) {
  for (const type of types) {
    const match = videos.find((v) => v.site === 'YouTube' && v.type === type);
    if (match) return match.key;
  }
  return videos.find((v) => v.site === 'YouTube')?.key ?? null;
}

/** GET /tv/{series_id} */
export async function fetchTvDetails(seriesId) {
  return tmdbFetch(`/tv/${seriesId}`);
}

/** GET /tv/{series_id}/season/{season_number} */
export async function fetchTvSeason(seriesId, seasonNumber) {
  return tmdbFetch(`/tv/${seriesId}/season/${seasonNumber}`);
}

/**
 * GET /tv/{series_id}/season/{season_number}/episode/{episode_number}/videos
 */
export async function fetchEpisodeVideos(seriesId, seasonNumber, episodeNumber) {
  const data = await tmdbFetch(
    `/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}/videos`
  );
  return data.results ?? [];
}

export function isTvShow(item) {
  return item?.media_type === 'tv' || Boolean(item?.first_air_date && !item?.title);
}

export async function searchMovies(query) {
  if (!query.trim()) return [];
  const data = await tmdbFetch('/search/multi', { query: query.trim() });
  return (data.results ?? []).filter(
    (item) => item.media_type === 'movie' || item.media_type === 'tv'
  );
}
