import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'proyectos'
	},
	{
		path: 'login',
		loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
	},
	{
		path: 'proyectos',
		loadComponent: () => import('./features/proyectos/proyectos.component').then(m => m.ProyectosComponent)
	},
	{
		path: 'admin',
		loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent)
	}
];
