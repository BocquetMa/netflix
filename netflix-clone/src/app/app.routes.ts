import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { MovieDetail } from './components/movie-detail/movie-detail';
import { VideoPlayer } from './components/video-player/video-player';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Profile } from './components/profile/profile';
import { ProfileSelect } from './components/profile-select/profile-select';
import { Movies } from './components/movies/movies';
import { Series } from './components/series/series';
import { MyList } from './components/my-list/my-list';
import { Search } from './components/search/search';
import { SharedList } from './components/shared-list/shared-list';
import { Calendar } from './components/calendar/calendar';
import { Stats } from './components/stats/stats';
import { MoodComponent } from './components/mood/mood';
import { authGuard } from './guards/auth-guard';
import { profileGuard } from './guards/profile-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'shared-list/:token', component: SharedList },
  {
    path: 'select-profile',
    component: ProfileSelect,
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard]
  },
  {
    path: '',
    component: Home,
    canActivate: [authGuard, profileGuard]
  },
  {
    path: 'movies',
    component: Movies,
    canActivate: [authGuard, profileGuard]
  },
  {
    path: 'series',
    component: Series,
    canActivate: [authGuard, profileGuard]
  },
  {
    path: 'my-list',
    component: MyList,
    canActivate: [authGuard, profileGuard]
  },
  {
    path: 'search',
    component: Search,
    canActivate: [authGuard, profileGuard]
  },
  {
    path: 'calendar',
    component: Calendar,
    canActivate: [authGuard, profileGuard]
  },
  {
    path: 'stats',
    component: Stats,
    canActivate: [authGuard, profileGuard]
  },
  {
    path: 'mood',
    component: MoodComponent,
    canActivate: [authGuard, profileGuard]
  },
  {
    path: 'movie/:id',
    component: MovieDetail,
    canActivate: [authGuard, profileGuard]
  },
  {
    path: 'watch/:id',
    component: VideoPlayer,
    canActivate: [authGuard, profileGuard]
  },
  { path: '**', redirectTo: 'login' }
];
