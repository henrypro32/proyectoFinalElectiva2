import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private _user$ = new BehaviorSubject<User | null>(null);
  private _token: string | null = null;

  // Mock data para desarrollo
  private mockUsers: User[] = [
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan.perez@estudiante.com',
      role: 'student',
      studentId: '20201234',
      semester: '8',
      program: 'Ingeniería de Sistemas',
      createdAt: new Date('2023-01-15'),
      lastLogin: new Date(),
      isActive: true,
      uploadedWorks: ['work1', 'work2'],
      favoriteWorks: ['work3', 'work4']
    },
    {
      id: '2',
      name: 'Dr. María García',
      email: 'maria.garcia@profesor.com',
      role: 'professor',
      program: 'Ingeniería de Sistemas',
      createdAt: new Date('2022-08-01'),
      lastLogin: new Date(),
      isActive: true,
      uploadedWorks: [],
      favoriteWorks: []
    },
    {
      id: '3',
      name: 'Admin Sistema',
      email: 'admin@universidad.com',
      role: 'admin',
      createdAt: new Date('2022-01-01'),
      lastLogin: new Date(),
      isActive: true,
      uploadedWorks: [],
      favoriteWorks: []
    }
  ];

  constructor() {
    // Verificar si hay una sesión guardada
    this.loadStoredSession();
  }

  get user$(): Observable<User | null> {
    return this._user$.asObservable();
  }

  get user(): User | null {
    return this._user$.value;
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    // Simular autenticación
    const user = this.mockUsers.find(u => u.email === credentials.email);
    
    if (!user) {
      return throwError(() => new Error('Usuario no encontrado'));
    }

    // Simular validación de contraseña
    if (credentials.password !== 'password123') {
      return throwError(() => new Error('Contraseña incorrecta'));
    }

    const token = this.generateMockToken(user);
    const refreshToken = this.generateMockToken(user, 'refresh');

    const authResponse: AuthResponse = {
      user,
      token,
      refreshToken
    };

    return of(authResponse).pipe(
      delay(1000), // Simular latencia de red
      map(response => {
        this.setSession(response);
        return response;
      })
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    // Verificar si el email ya existe
    if (this.mockUsers.find(u => u.email === userData.email)) {
      return throwError(() => new Error('El email ya está registrado'));
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: 'student',
      studentId: userData.studentId,
      semester: userData.semester,
      program: userData.program,
      createdAt: new Date(),
      lastLogin: new Date(),
      isActive: true,
      uploadedWorks: [],
      favoriteWorks: []
    };

    // Añadir a la lista mock
    this.mockUsers.push(newUser);

    const token = this.generateMockToken(newUser);
    const refreshToken = this.generateMockToken(newUser, 'refresh');

    const authResponse: AuthResponse = {
      user: newUser,
      token,
      refreshToken
    };

    return of(authResponse).pipe(
      delay(1000),
      map(response => {
        this.setSession(response);
        return response;
      })
    );
  }

  logout(): void {
    this._user$.next(null);
    this._token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('refresh_token');
  }

  isAuthenticated(): boolean {
    return this._user$.value !== null && this._token !== null;
  }

  hasRole(role: User['role']): boolean {
    return this._user$.value?.role === role;
  }

  hasAnyRole(roles: User['role'][]): boolean {
    const userRole = this._user$.value?.role;
    return userRole ? roles.includes(userRole) : false;
  }

  getToken(): string | null {
    return this._token;
  }

  private setSession(authResponse: AuthResponse): void {
    this._user$.next(authResponse.user);
    this._token = authResponse.token;
    
    // Guardar en localStorage
    localStorage.setItem('auth_token', authResponse.token);
    localStorage.setItem('auth_user', JSON.stringify(authResponse.user));
    localStorage.setItem('refresh_token', authResponse.refreshToken);
    
    // Actualizar último login
    authResponse.user.lastLogin = new Date();
  }

  private loadStoredSession(): void {
    const token = localStorage.getItem('auth_token');
    const userJson = localStorage.getItem('auth_user');

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        this._token = token;
        this._user$.next(user);
      } catch (error) {
        // Si hay error al parsear, limpiar storage
        this.logout();
      }
    }
  }

  private generateMockToken(user: User, type: 'access' | 'refresh' = 'access'): string {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      type,
      exp: Date.now() + (type === 'access' ? 3600000 : 604800000) // 1h o 7 días
    };
    return btoa(JSON.stringify(payload));
  }
}
