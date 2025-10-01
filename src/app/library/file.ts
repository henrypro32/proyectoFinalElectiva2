import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { delay, map, filter } from 'rxjs/operators';
import { AcademicWork, WorkCategory, SearchFilters, UploadRequest } from '../shared/models/academic-work.model';

@Injectable({
  providedIn: 'root'
})
export class AcademicWorkService {
  private _works$ = new BehaviorSubject<AcademicWork[]>([]);
  private _categories$ = new BehaviorSubject<WorkCategory[]>([]);

  // Mock data para desarrollo
  private mockCategories: WorkCategory[] = [
    { id: '1', name: 'Programación', description: 'Trabajos de programación y desarrollo', color: '#3b82f6' },
    { id: '2', name: 'Base de Datos', description: 'Proyectos de bases de datos', color: '#10b981' },
    { id: '3', name: 'Redes', description: 'Trabajos de redes y comunicaciones', color: '#f59e0b' },
    { id: '4', name: 'Inteligencia Artificial', description: 'Proyectos de IA y ML', color: '#8b5cf6' },
    { id: '5', name: 'Ingeniería de Software', description: 'Documentación y metodologías', color: '#ef4444' }
  ];

  private mockWorks: AcademicWork[] = [
    {
      id: '1',
      title: 'Sistema de Gestión Académica',
      description: 'Aplicación web para gestión de estudiantes y calificaciones desarrollada en Angular y Spring Boot',
      author: { id: '1', name: 'Juan Pérez', email: 'juan.perez@estudiante.com' },
      subject: 'Programación Web',
      semester: '7',
      professor: 'Dr. Carlos Mendoza',
      year: 2024,
      category: this.mockCategories[0],
      tags: ['Angular', 'Spring Boot', 'MySQL', 'REST API'],
      files: [
        {
          id: 'f1',
          name: 'Documentacion.pdf',
          type: 'pdf',
          url: '/assets/files/doc1.pdf',
          size: 2048000,
          uploadDate: new Date('2024-05-15')
        },
        {
          id: 'f2',
          name: 'codigo-fuente.zip',
          type: 'code',
          url: '/assets/files/code1.zip',
          size: 15728640,
          uploadDate: new Date('2024-05-15')
        }
      ],
      uploadDate: new Date('2024-05-15'),
      downloadCount: 45,
      rating: 4.5,
      reviews: [
        {
          id: 'r1',
          userId: '2',
          userName: 'Ana García',
          rating: 5,
          comment: 'Excelente trabajo, muy bien documentado',
          date: new Date('2024-05-20')
        }
      ],
      status: 'approved',
      isPublic: true
    },
    {
      id: '2',
      title: 'Análisis de Algoritmos de Ordenamiento',
      description: 'Comparación de rendimiento entre diferentes algoritmos de ordenamiento',
      author: { id: '3', name: 'María López', email: 'maria.lopez@estudiante.com' },
      subject: 'Algoritmos y Estructuras de Datos',
      semester: '5',
      professor: 'Dra. Elena Ruiz',
      year: 2024,
      category: this.mockCategories[0],
      tags: ['Algoritmos', 'Python', 'Análisis de Complejidad'],
      files: [
        {
          id: 'f3',
          name: 'Informe-Algoritmos.pdf',
          type: 'pdf',
          url: '/assets/files/algo-report.pdf',
          size: 1536000,
          uploadDate: new Date('2024-04-20')
        }
      ],
      uploadDate: new Date('2024-04-20'),
      downloadCount: 32,
      rating: 4.2,
      reviews: [],
      status: 'approved',
      isPublic: true
    },
    {
      id: '3',
      title: 'Red de Sensores IoT',
      description: 'Implementación de una red de sensores para monitoreo ambiental',
      author: { id: '4', name: 'Pedro Sánchez', email: 'pedro.sanchez@estudiante.com' },
      subject: 'Internet de las Cosas',
      semester: '8',
      professor: 'Ing. Roberto Castro',
      year: 2024,
      category: this.mockCategories[2],
      tags: ['IoT', 'Arduino', 'Sensores', 'WiFi'],
      files: [
        {
          id: 'f4',
          name: 'Proyecto-IoT.pdf',
          type: 'documentation',
          url: '/assets/files/iot-project.pdf',
          size: 3072000,
          uploadDate: new Date('2024-03-10')
        }
      ],
      uploadDate: new Date('2024-03-10'),
      downloadCount: 28,
      rating: 4.7,
      reviews: [],
      status: 'pending',
      isPublic: false
    }
  ];

  constructor() {
    this._categories$.next(this.mockCategories);
    this._works$.next(this.mockWorks);
  }

  // Observables públicos
  get works$(): Observable<AcademicWork[]> {
    return this._works$.asObservable();
  }

  get categories$(): Observable<WorkCategory[]> {
    return this._categories$.asObservable();
  }

  // Obtener trabajos aprobados y públicos
  getPublicWorks(): Observable<AcademicWork[]> {
    return this.works$.pipe(
      map(works => works.filter(work => work.status === 'approved' && work.isPublic))
    );
  }

  // Obtener trabajos pendientes de aprobación
  getPendingWorks(): Observable<AcademicWork[]> {
    return this.works$.pipe(
      map(works => works.filter(work => work.status === 'pending'))
    );
  }

  // Buscar trabajos con filtros
  searchWorks(filters: SearchFilters): Observable<AcademicWork[]> {
    return this.getPublicWorks().pipe(
      map(works => {
        let filteredWorks = [...works];

        if (filters.searchTerm) {
          const term = filters.searchTerm.toLowerCase();
          filteredWorks = filteredWorks.filter(work =>
            work.title.toLowerCase().includes(term) ||
            work.description.toLowerCase().includes(term) ||
            work.tags.some(tag => tag.toLowerCase().includes(term))
          );
        }

        if (filters.subject) {
          filteredWorks = filteredWorks.filter(work => 
            work.subject.toLowerCase().includes(filters.subject!.toLowerCase())
          );
        }

        if (filters.semester) {
          filteredWorks = filteredWorks.filter(work => work.semester === filters.semester);
        }

        if (filters.professor) {
          filteredWorks = filteredWorks.filter(work => 
            work.professor.toLowerCase().includes(filters.professor!.toLowerCase())
          );
        }

        if (filters.year) {
          filteredWorks = filteredWorks.filter(work => work.year === filters.year);
        }

        if (filters.category) {
          filteredWorks = filteredWorks.filter(work => work.category.id === filters.category);
        }

        if (filters.tags && filters.tags.length > 0) {
          filteredWorks = filteredWorks.filter(work =>
            filters.tags!.some(tag => work.tags.includes(tag))
          );
        }

        return filteredWorks;
      }),
      delay(500) // Simular latencia de búsqueda
    );
  }

  // Obtener trabajo por ID
  getWorkById(id: string): Observable<AcademicWork | undefined> {
    return this.works$.pipe(
      map(works => works.find(work => work.id === id))
    );
  }

  // Subir nuevo trabajo
  uploadWork(uploadData: UploadRequest): Observable<AcademicWork> {
    // Simular procesamiento de archivos
    const newWork: AcademicWork = {
      id: Date.now().toString(),
      title: uploadData.title,
      description: uploadData.description,
      author: { id: 'current-user', name: 'Usuario Actual', email: 'usuario@email.com' },
      subject: uploadData.subject,
      semester: uploadData.semester,
      professor: uploadData.professor,
      year: uploadData.year,
      category: this.mockCategories.find(c => c.id === uploadData.categoryId)!,
      tags: uploadData.tags,
      files: uploadData.files.map((file, index) => ({
        id: `f${Date.now()}-${index}`,
        name: file.name,
        type: this.getFileType(file.name),
        url: URL.createObjectURL(file),
        size: file.size,
        uploadDate: new Date()
      })),
      uploadDate: new Date(),
      downloadCount: 0,
      rating: 0,
      reviews: [],
      status: 'pending',
      isPublic: false
    };

    return of(newWork).pipe(
      delay(2000), // Simular tiempo de subida
      map(work => {
        const currentWorks = this._works$.value;
        this._works$.next([...currentWorks, work]);
        return work;
      })
    );
  }

  // Aprobar trabajo (solo admin)
  approveWork(workId: string): Observable<AcademicWork> {
    const works = this._works$.value;
    const workIndex = works.findIndex(w => w.id === workId);
    
    if (workIndex === -1) {
      return throwError(() => new Error('Trabajo no encontrado'));
    }

    const updatedWork = { ...works[workIndex], status: 'approved' as const, isPublic: true };
    const updatedWorks = [...works];
    updatedWorks[workIndex] = updatedWork;
    
    this._works$.next(updatedWorks);
    
    return of(updatedWork).pipe(delay(500));
  }

  // Rechazar trabajo (solo admin)
  rejectWork(workId: string, reason?: string): Observable<boolean> {
    const works = this._works$.value;
    const workIndex = works.findIndex(w => w.id === workId);
    
    if (workIndex === -1) {
      return throwError(() => new Error('Trabajo no encontrado'));
    }

    const updatedWork = { ...works[workIndex], status: 'rejected' as const };
    const updatedWorks = [...works];
    updatedWorks[workIndex] = updatedWork;
    
    this._works$.next(updatedWorks);
    
    return of(true).pipe(delay(500));
  }

  // Incrementar contador de descargas
  incrementDownloadCount(workId: string): Observable<boolean> {
    const works = this._works$.value;
    const workIndex = works.findIndex(w => w.id === workId);
    
    if (workIndex !== -1) {
      const updatedWork = { 
        ...works[workIndex], 
        downloadCount: works[workIndex].downloadCount + 1 
      };
      const updatedWorks = [...works];
      updatedWorks[workIndex] = updatedWork;
      
      this._works$.next(updatedWorks);
    }
    
    return of(true);
  }

  // Obtener trabajos más populares
  getPopularWorks(limit: number = 10): Observable<AcademicWork[]> {
    return this.getPublicWorks().pipe(
      map(works => works
        .sort((a, b) => b.downloadCount - a.downloadCount)
        .slice(0, limit)
      )
    );
  }

  // Obtener trabajos recientes
  getRecentWorks(limit: number = 10): Observable<AcademicWork[]> {
    return this.getPublicWorks().pipe(
      map(works => works
        .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
        .slice(0, limit)
      )
    );
  }

  private getFileType(fileName: string): 'pdf' | 'code' | 'documentation' | 'presentation' | 'other' {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return 'pdf';
      case 'zip':
      case 'rar':
      case 'tar':
      case 'gz':
        return 'code';
      case 'doc':
      case 'docx':
      case 'txt':
        return 'documentation';
      case 'ppt':
      case 'pptx':
        return 'presentation';
      default:
        return 'other';
    }
  }
}
