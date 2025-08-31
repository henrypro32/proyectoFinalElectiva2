import { Injectable } from '@angular/core';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'professor' | 'admin';
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  // Estado mínimo en memoria para desarrollo
  private _user: User | null = null;

  signIn(user: User) {
    this._user = user;
  }

  signOut() {
    this._user = null;
  }

  isAuthenticated(): boolean {
    return this._user !== null;
  }

  get user(): User | null {
    return this._user;
  }

  hasRole(role: User['role']): boolean {
    return this._user?.role === role;
  }
}
