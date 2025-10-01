import { Routes } from '@angular/router';
import { roleGuard } from './core/role-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'library', pathMatch: 'full' },
  {
    path: 'admin',
    canActivate: [roleGuard],
    loadChildren: () => import('./admin/admin-module').then(m => m.AdminModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'library',
    loadChildren: () => import('./library/library-module').then(m => m.LibraryModule)
  },
  {
    path: 'courses',
    loadChildren: () => import('./courses/courses-module').then(m => m.CoursesModule)
  }
];