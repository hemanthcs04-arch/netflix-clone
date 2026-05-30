const YOUTUBE_BASE = 'https://www.googleapis.com/youtube/v3';
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

/**
 * Search YouTube for a trailer when TMDB has no video key.
 * Requires a YouTube Data API v3 key (Google Cloud Console).
 */
export async function searchTrailer(title, year) {
  if (!API_KEY) return null;

  const query = year
    ? `${title} ${year} official trailer`
    : `${title} official trailer`;

  const params = new URLSearchParams({
    key: API_KEY,
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: '1',
    videoEmbeddable: 'true',
  });

  const res = await fetch(`${YOUTUBE_BASE}/search?${params}`);
  if (!res.ok) return null;

  const data = await res.json();
  return data.items?.[0]?.id?.videoId ?? null;
}

export function youtubeEmbedUrl(videoId) {
  const params = new URLSearchParams({
    autoplay: '1',
    rel: '0',
    modestbranding: '1',
    enablejsapi: '1',
  });
  return `https://www.youtube.com/embed/${videoId}?${params}`;
}
