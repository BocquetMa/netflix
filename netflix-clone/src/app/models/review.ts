export interface Review {
  id: string;           // `${profileId}_${movieId}`
  profileId: number;
  profileName: string;
  profileAvatar: string;
  movieId: number;
  rating: number;       // 1-5
  comment: string;
  createdAt: number;    // Date.now()
}
