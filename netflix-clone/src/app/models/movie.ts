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
  featured?: boolean;
}
