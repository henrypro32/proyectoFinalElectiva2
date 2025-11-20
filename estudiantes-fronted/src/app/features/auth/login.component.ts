// src/app/features/auth/login/login.component.ts

import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-container">
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-card">
        <h2>Iniciar sesión</h2>
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" formControlName="email" class="form-control" />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" type="password" formControlName="password" class="form-control" />
        </div>
        <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
        <button type="submit" class="btn-primary" [disabled]="loading">{{ loading ? 'Entrando...' : 'Entrar' }}</button>
      </form>
    </div>
  `,
  styles: [`.login-container { display:flex; justify-content:center; padding:2rem } .login-card{width:320px;padding:1rem;border-radius:8px;background:#fff} .form-group{margin-bottom:0.75rem}.error{color:#c00;margin-top:0.5rem}`]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/proyectos']);
        },
        error: (error: any) => {
          this.loading = false;
          this.errorMessage = error.error?.mensaje || 'Error al iniciar sesión';
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}