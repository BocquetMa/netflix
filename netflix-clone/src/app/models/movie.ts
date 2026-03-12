export interface Movie {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  backdropUrl: string;
  year: number;
  duration: string;
  genre: string[];
  rating: number;
  type: 'movie' | 'series';
  mediaType?: 'movie' | 'tv';
  featured?: boolean;
  trailerKey?: string;
  releaseDate?: string; // full ISO date string e.g. "2024-03-15"
}
