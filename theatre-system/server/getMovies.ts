import { Movie } from '@/types';

export const getMovies = async (date: string): Promise<Movie[]> => {
  try {
    const response = await fetch(`http://localhost:8080/api/movie/getAll/${date}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch movies: ${response.statusText}`);
    }
    const movies: Movie[] = await response.json();
    console.log('Fetched movies:', movies);
    return movies;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};
