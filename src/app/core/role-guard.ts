import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from './auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  // Permite el acceso solo si el usuario autenticado tiene rol 'admin'
  return auth.isAuthenticated() && auth.hasRole('admin');
};
