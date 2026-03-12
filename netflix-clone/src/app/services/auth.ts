import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  // Mock users database
  private mockUsers: User[] = [
    {
      id: 1,
      email: 'demo@netstream.com',
      name: 'Demo User',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      myList: [1, 3, 5]
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
    // Simulate API call
    return of(null).pipe(
      delay(1000),
      map(() => {
        // Mock authentication - accept any password for demo@netstream.com
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
        // Check if user already exists
        if (this.mockUsers.find(u => u.email === email)) {
          throw new Error('Cet email est déjà utilisé');
        }

        if (password.length < 6) {
          throw new Error('Le mot de passe doit contenir au moins 6 caractères');
        }

        // Create new user
        const newUser: User = {
          id: this.mockUsers.length + 1,
          email,
          name,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
          myList: []
        };

        this.mockUsers.push(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        this.currentUserSubject.next(newUser);
        return newUser;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserValue !== null;
  }

  addToMyList(movieId: number): void {
    const user = this.currentUserValue;
    if (user && !user.myList.includes(movieId)) {
      user.myList.push(movieId);
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
    }
  }

  removeFromMyList(movieId: number): void {
    const user = this.currentUserValue;
    if (user) {
      user.myList = user.myList.filter(id => id !== movieId);
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
    }
  }

  isInMyList(movieId: number): boolean {
    const user = this.currentUserValue;
    return user ? user.myList.includes(movieId) : false;
  }
}
