import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProyectosService } from '../../core/services/proyectos.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-container">
      <h2>Admin</h2>
      <section class="moderacion">
        <h3>Proyectos pendientes</h3>
        <div *ngIf="pendientes.length; else nada">
          <div *ngFor="let p of pendientes" class="pendiente-item">
            <strong>{{ p.titulo }}</strong> — <small>{{ p.descripcion }}</small>
            <div class="actions">
              <button (click)="aprobar(p.id)" class="btn-approve">Aprobar</button>
              <button (click)="rechazar(p.id)" class="btn-reject">Rechazar</button>
            </div>
          </div>
        </div>
        <ng-template #nada><p>No hay proyectos pendientes.</p></ng-template>
      </section>
    </div>
  `,
  styles: [
    `
    .moderacion{background:#fff;padding:1rem;border-radius:8px;border:1px solid #e6e9ee}
    .pendiente-item{display:flex;justify-content:space-between;align-items:center;padding:.5rem 0;border-bottom:1px dashed #eee}
    .actions button{margin-left:0.5rem}
    .btn-approve{background:#16a34a;color:#fff;border-radius:6px;padding:.35rem .5rem;border:none}
    .btn-reject{background:#ef4444;color:#fff;border-radius:6px;padding:.35rem .5rem;border:none}
    `
  ]
})
export class AdminComponent {
  pendientes: any[] = [];

  constructor(private svc: ProyectosService) {
    this.load();
  }

  load(){
    this.svc.pendientes().subscribe(list => this.pendientes = list || []);
  }

  aprobar(id: string){
    this.svc.aprobar(id).subscribe(()=> this.load());
  }

  rechazar(id: string){
    this.svc.rechazar(id).subscribe(()=> this.load());
  }
}
