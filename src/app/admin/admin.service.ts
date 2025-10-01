import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { AdminStats, ModerationAction, SystemSettings, Announcement } from '../shared/models/admin.model';
import { User } from '../shared/models/user.model';
import { AcademicWork } from '../shared/models/academic-work.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private _users$ = new BehaviorSubject<User[]>([]);
  private _moderationHistory$ = new BehaviorSubject<ModerationAction[]>([]);
  private _systemSettings$ = new BehaviorSubject<SystemSettings | null>(null);

  // Mock data
  private mockUsers: User[] = [
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan.perez@estudiante.com',
      role: 'student',
      studentId: '20201234',
      semester: '8',
      program: 'Ingeniería de Sistemas',
      createdAt: new Date('2023-01-15'),
      lastLogin: new Date(),
      isActive: true,
      uploadedWorks: ['work1', 'work2'],
      favoriteWorks: ['work3', 'work4']
    },
    {
      id: '2',
      name: 'Ana García',
      email: 'ana.garcia@estudiante.com',
      role: 'student',
      studentId: '20201567',
      semester: '6',
      program: 'Ingeniería de Sistemas',
      createdAt: new Date('2023-02-20'),
      lastLogin: new Date(Date.now() - 86400000), // Ayer
      isActive: true,
      uploadedWorks: ['work5'],
      favoriteWorks: ['work1', 'work2']
    },
    {
      id: '3',
      name: 'Dr. María García',
      email: 'maria.garcia@profesor.com',
      role: 'professor',
      program: 'Ingeniería de Sistemas',
      createdAt: new Date('2022-08-01'),
      lastLogin: new Date(),
      isActive: true,
      uploadedWorks: [],
      favoriteWorks: []
    }
  ];

  private mockSettings: SystemSettings = {
    maxFileSize: 50, // MB
    allowedFileTypes: ['pdf', 'zip', 'rar', 'doc', 'docx', 'ppt', 'pptx'],
    requireApproval: true,
    maintenanceMode: false,
    announcements: [
      {
        id: '1',
        title: 'Mantenimiento Programado',
        content: 'El sistema estará en mantenimiento el domingo de 2:00 AM a 4:00 AM',
        type: 'info',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
        isActive: true
      }
    ]
  };

  private mockModerationHistory: ModerationAction[] = [
    {
      id: '1',
      workId: 'work1',
      workTitle: 'Sistema de Gestión Académica',
      action: 'approve',
      moderatorId: 'admin1',
      moderatorName: 'Admin Sistema',
      date: new Date('2024-05-16')
    },
    {
      id: '2',
      workId: 'work2',
      workTitle: 'Análisis de Algoritmos',
      action: 'approve',
      moderatorId: 'admin1',
      moderatorName: 'Admin Sistema',
      date: new Date('2024-04-21')
    }
  ];

  constructor() {
    this._users$.next(this.mockUsers);
    this._systemSettings$.next(this.mockSettings);
    this._moderationHistory$.next(this.mockModerationHistory);
  }

  // Obtener estadísticas del dashboard
  getDashboardStats(): Observable<AdminStats> {
    const stats: AdminStats = {
      totalUsers: this.mockUsers.length,
      totalWorks: 15, // Mock
      pendingApprovals: 3, // Mock
      totalDownloads: 245, // Mock
      monthlyStats: {
        uploads: 8,
        downloads: 156,
        newUsers: 5
      },
      popularWorks: [
        {
          id: '1',
          title: 'Sistema de Gestión Académica',
          downloads: 45,
          author: 'Juan Pérez'
        },
        {
          id: '2',
          title: 'Análisis de Algoritmos de Ordenamiento',
          downloads: 32,
          author: 'María López'
        },
        {
          id: '3',
          title: 'Red de Sensores IoT',
          downloads: 28,
          author: 'Pedro Sánchez'
        }
      ],
      categoryStats: [
        { categoryName: 'Programación', workCount: 6, downloadCount: 120 },
        { categoryName: 'Base de Datos', workCount: 3, downloadCount: 45 },
        { categoryName: 'Redes', workCount: 4, downloadCount: 67 },
        { categoryName: 'IA', workCount: 2, downloadCount: 13 }
      ]
    };

    return of(stats).pipe(delay(800));
  }

  // Gestión de usuarios
  getUsers(): Observable<User[]> {
    return this._users$.asObservable();
  }

  toggleUserStatus(userId: string): Observable<boolean> {
    const users = this._users$.value;
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      const updatedUser = { ...users[userIndex], isActive: !users[userIndex].isActive };
      const updatedUsers = [...users];
      updatedUsers[userIndex] = updatedUser;
      
      this._users$.next(updatedUsers);
    }
    
    return of(true).pipe(delay(500));
  }

  deleteUser(userId: string): Observable<boolean> {
    const users = this._users$.value;
    const filteredUsers = users.filter(u => u.id !== userId);
    
    this._users$.next(filteredUsers);
    
    return of(true).pipe(delay(500));
  }

  // Historial de moderación
  getModerationHistory(): Observable<ModerationAction[]> {
    return this._moderationHistory$.asObservable();
  }

  addModerationAction(action: Omit<ModerationAction, 'id' | 'date'>): Observable<ModerationAction> {
    const newAction: ModerationAction = {
      ...action,
      id: Date.now().toString(),
      date: new Date()
    };

    const currentHistory = this._moderationHistory$.value;
    this._moderationHistory$.next([newAction, ...currentHistory]);

    return of(newAction).pipe(delay(300));
  }

  // Configuración del sistema
  getSystemSettings(): Observable<SystemSettings> {
    return this._systemSettings$.asObservable();
  }

  updateSystemSettings(settings: Partial<SystemSettings>): Observable<SystemSettings> {
    const currentSettings = this._systemSettings$.value!;
    const updatedSettings = { ...currentSettings, ...settings };
    
    this._systemSettings$.next(updatedSettings);
    
    return of(updatedSettings).pipe(delay(800));
  }

  // Anuncios
  createAnnouncement(announcement: Omit<Announcement, 'id'>): Observable<Announcement> {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: Date.now().toString()
    };

    const currentSettings = this._systemSettings$.value!;
    const updatedSettings = {
      ...currentSettings,
      announcements: [newAnnouncement, ...currentSettings.announcements]
    };
    
    this._systemSettings$.next(updatedSettings);
    
    return of(newAnnouncement).pipe(delay(500));
  }

  deleteAnnouncement(announcementId: string): Observable<boolean> {
    const currentSettings = this._systemSettings$.value!;
    const updatedAnnouncements = currentSettings.announcements.filter(a => a.id !== announcementId);
    
    const updatedSettings = {
      ...currentSettings,
      announcements: updatedAnnouncements
    };
    
    this._systemSettings$.next(updatedSettings);
    
    return of(true).pipe(delay(300));
  }

  toggleAnnouncementStatus(announcementId: string): Observable<boolean> {
    const currentSettings = this._systemSettings$.value!;
    const announcements = currentSettings.announcements.map(a => 
      a.id === announcementId ? { ...a, isActive: !a.isActive } : a
    );
    
    const updatedSettings = {
      ...currentSettings,
      announcements
    };
    
    this._systemSettings$.next(updatedSettings);
    
    return of(true).pipe(delay(300));
  }

  // Reportes y exportación
  generateUserReport(): Observable<Blob> {
    // Simular generación de reporte
    const csvContent = this.generateUserCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    
    return of(blob).pipe(delay(2000));
  }

  generateWorkReport(): Observable<Blob> {
    // Simular generación de reporte
    const csvContent = this.generateWorkCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    
    return of(blob).pipe(delay(2000));
  }

  private generateUserCSV(): string {
    const headers = ['ID', 'Nombre', 'Email', 'Rol', 'Código Estudiantil', 'Semestre', 'Programa', 'Fecha Registro', 'Último Login', 'Activo'];
    const rows = this.mockUsers.map(user => [
      user.id,
      user.name,
      user.email,
      user.role,
      user.studentId || '',
      user.semester || '',
      user.program || '',
      user.createdAt.toISOString().split('T')[0],
      user.lastLogin?.toISOString().split('T')[0] || '',
      user.isActive ? 'Sí' : 'No'
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\\n');
  }

  private generateWorkCSV(): string {
    const headers = ['ID', 'Título', 'Autor', 'Materia', 'Semestre', 'Profesor', 'Año', 'Categoría', 'Estado', 'Descargas', 'Fecha Subida'];
    // Mock data for works
    const mockWorkRows = [
      ['1', 'Sistema de Gestión Académica', 'Juan Pérez', 'Programación Web', '7', 'Dr. Carlos Mendoza', '2024', 'Programación', 'Aprobado', '45', '2024-05-15'],
      ['2', 'Análisis de Algoritmos', 'María López', 'Algoritmos', '5', 'Dra. Elena Ruiz', '2024', 'Programación', 'Aprobado', '32', '2024-04-20']
    ];

    return [headers, ...mockWorkRows].map(row => row.join(',')).join('\\n');
  }
}