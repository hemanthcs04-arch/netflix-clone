const BASE_URL = 'https://api.themoviedb.org/3';
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

const IMAGE_BASE = 'https://image.tmdb.org/t/p';
export const BACKDROP_SIZE = 'original';
export const POSTER_SIZE = 'w500';
export const PROFILE_SIZE = 'w185';

/* ---------- helpers ---------- */

const headers = {
  Authorization: `Bearer ${ACCESS_TOKEN}`,
  'Content-Type': 'application/json;charset=utf-8',
};

async function tmdbFetch(endpoint) {
  const sep = endpoint.includes('?') ? '&' : '?';
  const url = `${BASE_URL}${endpoint}${sep}language=en-US`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`TMDB ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

/* ---------- Image URLs ---------- */

export function getBackdropUrl(path) {
  if (!path) return null;
  return `${IMAGE_BASE}/${BACKDROP_SIZE}${path}`;
}

export function getPosterUrl(path) {
  if (!path) return null;
  return `${IMAGE_BASE}/${POSTER_SIZE}${path}`;
}

export function getProfileUrl(path) {
  if (!path) return null;
  return `${IMAGE_BASE}/${PROFILE_SIZE}${path}`;
}

/* ---------- Browse page data ---------- */

export async function fetchTrending() {
  const data = await tmdbFetch('/trending/all/week');
  return data.results;
}

export async function fetchNetflixOriginals() {
  const data = await tmdbFetch('/discover/tv?with_networks=213');
  return data.results;
}

export async function fetchTopRated() {
  const data = await tmdbFetch('/movie/top_rated');
  return data.results;
}

export async function fetchByGenre(genreId) {
  const data = await tmdbFetch(`/discover/movie?with_genres=${genreId}`);
  return data.results;
}

export async function fetchPopularTV() {
  const data = await tmdbFetch('/tv/popular');
  return data.results;
}

export async function fetchTrendingTV() {
  const data = await tmdbFetch('/trending/tv/week');
  return data.results;
}

export async function fetchTVByGenre(genreId) {
  const data = await tmdbFetch(`/discover/tv?with_genres=${genreId}`);
  return data.results;
}

/* ---------- Detail page ---------- */

export async function fetchMovieDetail(id) {
  return tmdbFetch(`/movie/${id}?append_to_response=videos,credits,similar,images`);
}

export async function fetchTVDetail(id) {
  return tmdbFetch(`/tv/${id}?append_to_response=videos,credits,similar,images`);
}

/* ---------- Search ---------- */

export async function searchMulti(query) {
  const data = await tmdbFetch(`/search/multi?query=${encodeURIComponent(query)}&include_adult=false`);
  return data.results.filter(
    (item) => item.media_type === 'movie' || item.media_type === 'tv'
  );
}

/* ---------- Genres ---------- */

export async function fetchGenres() {
  const data = await tmdbFetch('/genre/movie/list');
  return data.genres;
}

/* ---------- Trailer helper ---------- */

export function pickTrailerKey(videos) {
  if (!videos || !videos.results || videos.results.length === 0) return null;
  const youtubeVideos = videos.results.filter((v) => v.site === 'YouTube');
  const trailer = youtubeVideos.find((v) => v.type === 'Trailer');
  if (trailer) return trailer.key;
  const teaser = youtubeVideos.find((v) => v.type === 'Teaser');
  if (teaser) return teaser.key;
  const clip = youtubeVideos.find((v) => v.type === 'Clip');
  if (clip) return clip.key;
  if (youtubeVideos.length > 0) return youtubeVideos[0].key;
  return null;
}

/* ---------- Predefined row configs ---------- */

export const MOVIE_ROWS = [
  { title: 'Trending Now', fetcher: fetchTrending },
  { title: 'Top Rated', fetcher: fetchTopRated },
  { title: 'Action Movies', fetcher: () => fetchByGenre(28) },
  { title: 'Comedy Movies', fetcher: () => fetchByGenre(35) },
  { title: 'Horror Movies', fetcher: () => fetchByGenre(27) },
  { title: 'Romance Movies', fetcher: () => fetchByGenre(10749) },
  { title: 'Documentaries', fetcher: () => fetchByGenre(99) },
];

export const TV_ROWS = [
  { title: 'Popular TV Shows', fetcher: fetchPopularTV },
  { title: 'Trending Series', fetcher: fetchTrendingTV },
  { title: 'Drama Series', fetcher: () => fetchTVByGenre(18) },
  { title: 'Crime Series', fetcher: () => fetchTVByGenre(80) },
  { title: 'Sci-Fi & Fantasy', fetcher: () => fetchTVByGenre(10765) },
];
