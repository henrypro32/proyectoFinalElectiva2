import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProyectosService } from '../../core/services/proyectos.service';
import { Proyecto, ProyectoCardComponent } from './proyecto-card.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule, FormsModule, ProyectoCardComponent],
  template: `
    <div class="proyectos-container">
      <h2>Proyectos</h2>

      <section class="crear">
        <h3>Crear proyecto (demo)</h3>
        <form class="crear-form" (ngSubmit)="crear()" autocomplete="off">
          <div class="form-grid">
            <div class="form-group">
              <label for="titulo">Título</label>
              <input id="titulo" name="titulo" class="form-control" [(ngModel)]="nuevo.titulo" required />
            </div>

            <div class="form-group">
              <label for="materia">Materia (id)</label>
              <input id="materia" name="materia" class="form-control" [(ngModel)]="nuevo.materia_id" placeholder="opcional - copia id de /seed" />
            </div>
          </div>

          <div class="form-group">
            <label for="descripcion">Descripción</label>
            <textarea id="descripcion" rows="4" name="descripcion" class="form-control" [(ngModel)]="nuevo.descripcion" placeholder="Breve descripción del proyecto"></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Crear</button>
            <button type="button" class="btn btn-secondary" (click)="nuevo = { titulo: '', descripcion: '', materia_id: '' }">Limpiar</button>
          </div>
        </form>
      </section>

      <div *ngIf="proyectos.length; else noResults">
        <ng-container *ngFor="let p of proyectos">
          <app-proyecto-card [proyecto]="p"></app-proyecto-card>
        </ng-container>
      </div>
      <ng-template #noResults><p>No hay proyectos</p></ng-template>
    </div>
  `
  ,
  styles: [
    `
    .proyectos-container {
      max-width: 980px;
      margin: 0 auto;
      padding: 1rem;
    }

    .crear {
      background: #fafbfc;
      border: 1px solid #e6e9ee;
      padding: 1rem 1rem 0.75rem 1rem;
      border-radius: 8px;
      margin-bottom: 1.25rem;
      box-shadow: 0 1px 2px rgba(16,24,40,0.03);
    }

    .crear h3 {
      margin: 0 0 0.75rem 0;
      font-size: 1.125rem;
      color: #1f2937;
    }

    .crear-form {
      display: block;
    }

    .form-grid {
      display: grid;
      gap: 0.75rem;
      grid-template-columns: 1fr;
    }

    @media (min-width: 700px) {
      .form-grid { grid-template-columns: 1fr 360px; }
    }

    .form-group { margin-bottom: 0.75rem; }

    .form-group label { display:block; font-weight:600; margin-bottom:0.35rem; color:#374151 }

    .form-control {
      width:100%;
      box-sizing: border-box;
      padding: 0.5rem 0.625rem;
      border-radius: 6px;
      border: 1px solid #d1d5db;
      background: #fff;
      font-size: 0.95rem;
      color: #111827;
    }

    .form-control:focus { outline: none; box-shadow: 0 0 0 4px rgba(99,102,241,0.08); border-color: #6366f1 }

    .form-actions { display:flex; gap:0.5rem; margin-top:0.5rem }

    .btn { padding: 0.5rem 0.75rem; border-radius:6px; border: none; cursor:pointer; font-weight:600 }
    .btn-primary { background: #0f172a; color:#fff }
    .btn-primary:hover { background: #0b1220 }
    .btn-secondary { background: #e6eef8; color:#0f172a }
    .btn-secondary:hover { background: #d9e8ff }

    /* pequeños ajustes visuales para la lista de proyectos */
    app-proyecto-card { display:block; margin-bottom:0.75rem }
    `
  ]
})
export class ProyectosComponent {
  proyectos: Proyecto[] = [];
  materias: any[] = [];
  nuevo: any = { titulo: '', descripcion: '', materia_id: '' };

  constructor(private svc: ProyectosService, private auth: AuthService) {
    // Intentar listar proyectos protegidos; si falla (por falta de token), usar /seed como fallback
    this.svc.listar().subscribe({
      next: (data: any[]) => this.proyectos = data || [],
      error: () => this.svc.listarSeed().subscribe({ next: (seed: any) => {
        this.proyectos = seed.proyectos || [];
        this.materias = seed.materias || [];
      }})
    });
  }

  crear(){
    const payload = { ...this.nuevo };
    if (this.auth.isAuthenticated()){
      this.svc.crear(payload).subscribe({ next: () => {
        // refrescar
        this.svc.listar().subscribe({ next: (d:any[]) => this.proyectos = d || [] });
      }});
    } else {
      // crear localmente para demo si no estamos autenticados
      const nuevoProyecto: Proyecto = {
        id: 'local-' + Date.now(),
        titulo: payload.titulo,
        descripcion: payload.descripcion,
        archivo_url: '',
        tipo_archivo: '',
        tamano_archivo: 0,
        semestre: '',
        anio: new Date().getFullYear(),
        profesor: 'Demo',
        estado: 'pendiente',
        descargas: 0,
        vistas: 0,
        materia_id: payload.materia_id || ''
      };
      this.proyectos.unshift(nuevoProyecto);
      this.nuevo = { titulo: '', descripcion: '', materia_id: '' };
    }
  }
}

