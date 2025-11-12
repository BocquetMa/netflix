export interface User {
  id: number;
  email: string;
  name: string;
  avatar: string;
  myList: number[]; // IDs of movies in user's list
}
