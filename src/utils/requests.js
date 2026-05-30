export const movieCategories = [
  { title: 'Trending Movies', endpoint: '/trending/movie/week', mediaType: 'movie' },
  { title: 'Top Rated Movies', endpoint: '/movie/top_rated', mediaType: 'movie' },
  { title: 'Action', endpoint: '/discover/movie?with_genres=28', mediaType: 'movie' },
  { title: 'Comedy', endpoint: '/discover/movie?with_genres=35', mediaType: 'movie' },
  { title: 'Horror', endpoint: '/discover/movie?with_genres=27', mediaType: 'movie' },
  { title: 'Romance', endpoint: '/discover/movie?with_genres=10749', mediaType: 'movie' },
  { title: 'Documentaries', endpoint: '/discover/movie?with_genres=99', mediaType: 'movie' },
];

export const tvCategories = [
  { title: 'Trending Series', endpoint: '/trending/tv/week', mediaType: 'tv' },
  { title: 'Popular Series', endpoint: '/tv/popular', mediaType: 'tv' },
  { title: 'Netflux Originals', endpoint: '/discover/tv?with_networks=213', mediaType: 'tv' },
  { title: 'Drama Series', endpoint: '/discover/tv?with_genres=18', mediaType: 'tv' },
  { title: 'Comedy Series', endpoint: '/discover/tv?with_genres=35', mediaType: 'tv' },
  { title: 'Crime Series', endpoint: '/discover/tv?with_genres=80', mediaType: 'tv' },
  { title: 'Sci-Fi & Fantasy', endpoint: '/discover/tv?with_genres=10765', mediaType: 'tv' },
];
