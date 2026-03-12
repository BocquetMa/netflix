import { UserProfile } from './user-profile';

export interface User {
  id: number;
  email: string;
  name: string;
  avatar: string;
  profiles: UserProfile[];
}
