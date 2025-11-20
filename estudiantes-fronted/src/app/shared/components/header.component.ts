import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="app-header">
      <div class="container">
        <a class="brand" routerLink="/">
          <span class="logo">Estudiantes</span>
        </a>

        <nav class="main-nav" aria-label="Main navigation">
          <a routerLink="/proyectos" routerLinkActive="active" class="nav-link">Proyectos</a>
          <a routerLink="/admin" routerLinkActive="active" class="nav-link">Admin</a>
        </nav>

        <div class="header-actions">
          <ng-container *ngIf="auth.isAuthenticated(); else anon">
            <div class="user-block">
              <div class="avatar">{{ (auth.getSimUser()?.nombre || 'U').charAt(0) }}</div>
              <div class="user-meta">
                <div class="user-name">{{ auth.getSimUser()?.nombre || 'Usuario' }}</div>
                <div class="user-role">{{ auth.getSimUser()?.rol || '' }}</div>
              </div>
            </div>
            <button class="btn btn-logout" (click)="logout()">Salir</button>
          </ng-container>
          <ng-template #anon>
            <a routerLink="/login" class="btn btn-login">Ingresar</a>
          </ng-template>
        </div>
      </div>
    </header>
  `,
  styles: [
    `:host { display:block }
    .app-header {
      width:100%;
      background: linear-gradient(90deg, #0b1220 0%, #0f172a 100%);
      color: #ffffff;
      box-shadow: 0 2px 6px rgba(2,6,23,0.2);
    }

    .container {
      max-width:1100px;
      margin:0 auto;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:1rem;
      padding:0.6rem 1rem;
    }

    .brand { text-decoration:none; color:inherit; display:flex; align-items:center }
    .logo { font-weight:800; font-size:1.1rem; letter-spacing:0.4px }

    .main-nav { display:flex; gap:0.75rem; align-items:center }
    .nav-link {
      color: rgba(255,255,255,0.9);
      text-decoration:none;
      padding:0.4rem 0.6rem;
      border-radius:6px;
      font-weight:600;
      transition: background 120ms ease, color 120ms ease, transform 120ms ease;
    }
    .nav-link:hover { background: rgba(255,255,255,0.03); transform: translateY(-1px) }
    .nav-link.active { background: rgba(255,255,255,0.06); box-shadow: inset 0 -2px 0 rgba(255,255,255,0.06) }

    .header-actions { display:flex; align-items:center; gap:0.6rem }
    .user-block { display:flex; align-items:center; gap:0.6rem; padding:0.15rem 0.35rem }
    .avatar { width:36px; height:36px; border-radius:10px; background:#ffffff11; display:flex; align-items:center; justify-content:center; font-weight:700 }
    .user-meta { display:flex; flex-direction:column; line-height:1 }
    .user-name { font-weight:700; font-size:0.9rem }
    .user-role { font-size:0.75rem; color: #cbd5e1; text-transform:capitalize }

    .btn { border: none; cursor:pointer; padding:0.45rem 0.65rem; border-radius:8px; font-weight:600 }
    .btn-login { background: linear-gradient(90deg,#60a5fa,#3b82f6); color:white; text-decoration:none }
    .btn-logout { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.08) }

    @media (max-width: 720px) {
      .main-nav { display:none }
      .user-meta { display:none }
      .logo { font-size:1rem }
      .container { padding:0.5rem }
    }
    `
  ]
})
export class HeaderComponent {
  constructor(public auth: AuthService) {}

  logout(){ this.auth.logout(); window.location.href = '/'; }
}
