import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { MovieDetail } from './components/movie-detail/movie-detail';
import { VideoPlayer } from './components/video-player/video-player';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Profile } from './components/profile/profile';
import { Movies } from './components/movies/movies';
import { Series } from './components/series/series';
import { MyList } from './components/my-list/my-list';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: '',
    component: Home,
    canActivate: [authGuard]
  },
  {
    path: 'movies',
    component: Movies,
    canActivate: [authGuard]
  },
  {
    path: 'series',
    component: Series,
    canActivate: [authGuard]
  },
  {
    path: 'my-list',
    component: MyList,
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard]
  },
  {
    path: 'movie/:id',
    component: MovieDetail,
    canActivate: [authGuard]
  },
  {
    path: 'watch/:id',
    component: VideoPlayer,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'login' }
];
