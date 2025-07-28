import axios from 'axios';
import type { Movie } from '../types/movie';

export interface MovieHttpResponse {
  results: Movie[];
  total_pages: number;
}

const URL = 'https://api.themoviedb.org/3/search/movie';

export const fetchMovies = async (query: string, page: number): Promise<MovieHttpResponse> => {
  const token = import.meta.env.VITE_TMDB_TOKEN;
  if (!token) {
    throw new Error('TMDB token is missing. Please set VITE_TMDB_TOKEN in your .env file.');
  }

  try {
    const response = await axios.get<MovieHttpResponse>(URL, {
      params: {
        query,
        include_adult: false,
        language: 'en-US',
        page,
      },
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`, // Переконайтеся, що Bearer додано
      },
    });
    return response.data;
  } catch (error) {
    console.error('Fetch movies error:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch movies');
  }
};

export const imgURL = 'https://image.tmdb.org/t/p/w500';