import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';

const API_URL = 'http://localhost:5000';
const SIM_USER_KEY = 'sim_users_current';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && !!(window as any).localStorage;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  /**
   * Intenta login contra backend; si falla, usa simulación local.
   * Simulación: cualquier email/password funcionará; si el email contiene 'admin' se marca rol admin.
   */
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${API_URL}/auth/login`, credentials).pipe(
      tap(response => {
        const token = response?.access_token || response?.token;
        if (token && isBrowser()) {
          (window as any).localStorage.setItem('access_token', token);
        }
      }),
      catchError(() => {
        // Fallback: simulación local sin backend (solo devolver respuesta; no tocar localStorage en SSR)
        const isAdmin = credentials.email?.toLowerCase().includes('admin');
        const fakeToken = 'sim-token-' + Date.now();
        const user = { email: credentials.email, nombre: credentials.email.split('@')[0] || credentials.email, rol: isAdmin ? 'admin' : 'estudiante', token: fakeToken };
        if (isBrowser()) {
          (window as any).localStorage.setItem('access_token', fakeToken);
          (window as any).localStorage.setItem(SIM_USER_KEY, JSON.stringify(user));
        }
        return of({ access_token: fakeToken, user });
      })
    );
  }

  logout(): void {
    if (isBrowser()) {
      (window as any).localStorage.removeItem('access_token');
      (window as any).localStorage.removeItem(SIM_USER_KEY);
    }
  }

  getToken(): string | null {
    if (!isBrowser()) return null;
    return (window as any).localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /** Dev helper: obtener usuario simulado si existe */
  getSimUser(): any | null {
    if (!isBrowser()) return null;
    try { return JSON.parse((window as any).localStorage.getItem(SIM_USER_KEY) || 'null'); } catch { return null; }
  }
}
