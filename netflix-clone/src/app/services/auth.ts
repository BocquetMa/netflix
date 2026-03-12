import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User } from '../models/user';
import { UserProfile } from '../models/user-profile';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  private mockUsers: User[] = [
    {
      id: 1,
      email: 'demo@netstream.com',
      name: 'Demo Account',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      profiles: [
        {
          id: 1,
          name: 'Demo',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
          myList: [1, 3, 5],
          isKids: false
        },
        {
          id: 2,
          name: 'Enfants',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
          myList: [],
          isKids: true
        }
      ]
    }
  ];

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        const user = this.mockUsers.find(u => u.email === email);
        if (!user || password.length < 4) {
          throw new Error('Email ou mot de passe incorrect');
        }
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  register(email: string, password: string, name: string): Observable<User> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        if (this.mockUsers.find(u => u.email === email)) {
          throw new Error('Cet email est déjà utilisé');
        }
        if (password.length < 6) {
          throw new Error('Le mot de passe doit contenir au moins 6 caractères');
        }

        const defaultProfile: UserProfile = {
          id: 1,
          name,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
          myList: [],
          isKids: false
        };

        const newUser: User = {
          id: this.mockUsers.length + 1,
          email,
          name,
          avatar: defaultProfile.avatar,
          profiles: [defaultProfile]
        };

        this.mockUsers.push(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        this.currentUserSubject.next(newUser);
        return newUser;
      })
    );
  }

  updateUser(user: User): void {
    const idx = this.mockUsers.findIndex(u => u.id === user.id);
    if (idx !== -1) this.mockUsers[idx] = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserValue !== null;
  }
}
