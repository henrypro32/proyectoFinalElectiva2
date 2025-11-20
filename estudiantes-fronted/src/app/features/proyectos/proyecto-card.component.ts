import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProyectosService } from '../../core/services/proyectos.service';

export interface Proyecto {
  id: string;
  titulo: string;
  descripcion: string;
  archivo_url?: string;
  tipo_archivo?: string;
  tamano_archivo?: number;
  semestre?: string;
  anio?: number;
  profesor?: string;
  estado?: string;
  materia_id?: string;
  descargas?: number;
  vistas?: number;
}

@Component({
  selector: 'app-proyecto-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="proyecto-card">
      <div class="proyecto-header">
        <h3>{{ proyecto.titulo }}</h3>
        <span class="estado-badge" [ngClass]="estadoClass(proyecto.estado)">{{ proyecto.estado }}</span>
      </div>
      <div class="proyecto-body">
        <p class="descripcion">{{ proyecto.descripcion }}</p>
        <div class="proyecto-info">
          <div class="info-item"><strong>Profesor:</strong> {{ proyecto.profesor }}</div>
          <div class="info-item"><strong>Materia:</strong> {{ proyecto.materia_id || 'N/A' }}</div>
          <div class="info-item"><strong>Año:</strong> {{ proyecto.anio || '–' }}</div>
        </div>
        <div class="proyecto-stats">
          <small>Vistas: {{ proyecto.vistas || 0 }}</small>
          <small>Descargas: {{ proyecto.descargas || 0 }}</small>
        </div>
        <div class="proyecto-actions">
          <a *ngIf="proyecto.archivo_url" (click)="onDownload($event)" class="btn-view" role="button">Ver / Descargar</a>
        </div>
      </div>
    </article>
  `,
  styles: [`
    .proyecto-card{border:1px solid #e0e0e0;padding:1rem;border-radius:8px;margin-bottom:0.75rem;background:#fff}
    .proyecto-header{display:flex;justify-content:space-between;align-items:center}
    .estado-badge{padding:.25rem .5rem;border-radius:12px;font-size:.75rem}
    .estado-aprobado{background:#e6f4ea;color:#117a37}
    .estado-pendiente{background:#fff4e5;color:#b36b00}
    .estado-rechazado{background:#fdecea;color:#8a1f11}
    .proyecto-info{display:flex;gap:1rem;margin-top:.5rem;flex-wrap:wrap}
    .proyecto-actions{margin-top:.75rem}
    .btn-view{background:#1976d2;color:white;padding:.4rem .6rem;border-radius:6px;text-decoration:none}
  `]
})
export class ProyectoCardComponent {
  @Input() proyecto!: Proyecto;
  constructor(private svc: ProyectosService) {}

  estadoClass(estado?: string){
    if(!estado) return '';
    return {
      'estado-aprobado': estado.toLowerCase() === 'aprobado',
      'estado-pendiente': estado.toLowerCase() === 'pendiente',
      'estado-rechazado': estado.toLowerCase() === 'rechazado'
    };
  }

  onDownload(e: Event){
    e.preventDefault();
    if (!this.proyecto) return;
    // registrar descarga en servicio (simulado si es necesario)
    this.svc.registrarDescarga(this.proyecto.id).subscribe(()=>{
      // abrir recurso si existe
      if (this.proyecto.archivo_url) {
        try { window.open(this.proyecto.archivo_url, '_blank'); } catch {}
      }
    });
  }
}
