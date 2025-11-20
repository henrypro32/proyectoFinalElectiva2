import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, delay } from 'rxjs';
import { DEFAULT_PROYECTOS, DEFAULT_MATERIAS } from '../data/seed';

// Resolve API URL at runtime to avoid accessing `window` during SSR (module import).
function getApiUrl(): string {
  try {
    if (typeof window !== 'undefined' && (window as any).__env && (window as any).__env.API_URL) {
      return (window as any).__env.API_URL;
    }
  } catch { /* noop */ }
  return 'http://localhost:5000';
}
const STORAGE_KEY = 'sim_proyectos_v1';
const STORAGE_MATERIAS = 'sim_materias_v1';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && !!(window as any).localStorage;
}

@Injectable({ providedIn: 'root' })
export class ProyectosService {
  private inMemory: any[] = [];

  constructor(private http: HttpClient) {
    // inicializar desde localStorage si existe (solo en navegador)
    if (isBrowser()) {
      const raw = (window as any).localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try { this.inMemory = JSON.parse(raw); } catch { this.inMemory = []; }
      }
      // si no hay datos, usar la semilla y persistirla para que siempre haya ejemplos
      if (!this.inMemory || !this.inMemory.length) {
        this.inMemory = DEFAULT_PROYECTOS.map(p => ({ ...p }));
        this.persist();
      }
    } else {
      // en SSR podemos cargar la semilla para renderizar contenido estático
      this.inMemory = DEFAULT_PROYECTOS.map(p => ({ ...p }));
    }
  }

  private persist() {
    if (!isBrowser()) return;
    try { (window as any).localStorage.setItem(STORAGE_KEY, JSON.stringify(this.inMemory)); } catch { /* noop */ }
  }

  /** Listar proyectos: intenta backend público; si falla, retorna datos simulados. */
  listar(): Observable<any> {
  return this.http.get<any>(`${getApiUrl()}/public/proyectos`).pipe(
      catchError(() => of(this.inMemory).pipe(delay(150)))
    );
  }

  listarSeed(): Observable<any> {
  return this.http.get<any>(`${getApiUrl()}/seed`).pipe(
      catchError(() => {
        // devolver estructura similar a seed con proyectos y materias (usar semilla si no hay localStorage)
        let materias: any[] = [];
        if (isBrowser()) {
          const materiasRaw = (window as any).localStorage.getItem(STORAGE_MATERIAS);
          materias = materiasRaw ? JSON.parse(materiasRaw) : DEFAULT_MATERIAS.map(m => ({ ...m }));
        } else {
          materias = DEFAULT_MATERIAS.map(m => ({ ...m }));
        }
        const proyectos = (this.inMemory && this.inMemory.length) ? this.inMemory : DEFAULT_PROYECTOS.map(p => ({ ...p }));
        return of({ proyectos, materias }).pipe(delay(150));
      })
    );
  }

  crear(proyecto: any): Observable<any> {
    // intentar crear contra backend; si falla, simular localmente
  return this.http.post<any>(`${getApiUrl()}/proyectos`, proyecto).pipe(
      catchError(() => {
        const id = 'local-' + Date.now();
        const newP = {
          id,
          titulo: proyecto.titulo || 'Sin título',
          descripcion: proyecto.descripcion || '',
          archivo_url: proyecto.archivo_url || '',
          tipo_archivo: proyecto.tipo_archivo || '',
          tamano_archivo: proyecto.tamano_archivo || 0,
          semestre: proyecto.semestre || '',
          anio: proyecto.anio || new Date().getFullYear(),
          profesor: proyecto.profesor || 'Desconocido',
          estado: proyecto.estado || 'pendiente',
          descargas: 0,
          vistas: 0,
          usuario_id: proyecto.usuario_id || 'local',
          materia_id: proyecto.materia_id || ''
        };
        this.inMemory.unshift(newP);
        this.persist();
        return of(newP).pipe(delay(120));
      })
    );
  }

  // Incrementa descargas localmente (y en backend si disponible)
  registrarDescarga(id: string): Observable<any> {
    // intentar backend simplificado
  return this.http.post<any>(`${getApiUrl()}/proyectos/${id}/download`, {}).pipe(
      catchError(() => {
        const p = this.inMemory.find((x: any) => x.id === id);
        if (p) { p.descargas = (p.descargas || 0) + 1; this.persist(); }
        return of(p).pipe(delay(80));
      })
    );
  }

  // Métodos de moderación (simulados)
  pendientes(): Observable<any[]> {
    const pendientes = this.inMemory.filter((p: any) => (p.estado || '').toLowerCase() === 'pendiente');
    return of(pendientes).pipe(delay(100));
  }

  aprobar(id: string): Observable<any> {
    const p = this.inMemory.find((x: any) => x.id === id);
    if (p) { p.estado = 'aprobado'; this.persist(); }
    return of(p).pipe(delay(100));
  }

  rechazar(id: string): Observable<any> {
    const p = this.inMemory.find((x: any) => x.id === id);
    if (p) { p.estado = 'rechazado'; this.persist(); }
    return of(p).pipe(delay(100));
  }

  // Gestión de materias mínima
  listarMaterias(): Observable<any[]> {
    if (!isBrowser()) return of([]).pipe(delay(80));
    const raw = (window as any).localStorage.getItem(STORAGE_MATERIAS);
    const materias = raw ? JSON.parse(raw) : [];
    return of(materias).pipe(delay(80));
  }

  agregarMateria(materia: any): Observable<any> {
    if (!isBrowser()) return of({ id: 'mat-' + Date.now(), ...materia }).pipe(delay(80));
    const raw = (window as any).localStorage.getItem(STORAGE_MATERIAS);
    const materias = raw ? JSON.parse(raw) : [];
    const nuevo = { id: 'mat-' + Date.now(), ...materia };
    materias.push(nuevo);
    try { (window as any).localStorage.setItem(STORAGE_MATERIAS, JSON.stringify(materias)); } catch { }
    return of(nuevo).pipe(delay(80));
  }
}
