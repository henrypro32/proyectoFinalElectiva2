import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AcademicWorkService } from '../file';
import { AcademicWork, WorkCategory, SearchFilters } from '../../shared/models/academic-work.model';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-file-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './file-list.html',
  styleUrl: './file-list.css'
})
export class FileList implements OnInit {
  works$!: Observable<AcademicWork[]>;
  categories$!: Observable<WorkCategory[]>;
  popularWorks$!: Observable<AcademicWork[]>;
  recentWorks$!: Observable<AcademicWork[]>;
  
  // Filtros de búsqueda
  searchFilters$ = new BehaviorSubject<SearchFilters>({});
  searchTerm = '';
  selectedCategory = '';
  selectedSemester = '';
  selectedYear: number | null = null;
  selectedSubject = '';
  
  // Estado de la UI
  isLoading = true;
  viewMode: 'grid' | 'list' = 'grid';
  sortBy: 'recent' | 'popular' | 'title' = 'recent';
  
  // Opciones para filtros
  semesterOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  yearOptions = [2024, 2023, 2022, 2021, 2020];
  
  constructor(
    private academicWorkService: AcademicWorkService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeData();
    this.setupSearch();
  }

  private initializeData(): void {
    this.categories$ = this.academicWorkService.categories$;
    this.popularWorks$ = this.academicWorkService.getPopularWorks(5);
    this.recentWorks$ = this.academicWorkService.getRecentWorks(5);
    
    // Simular carga inicial
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  private setupSearch(): void {
    // Combinar filtros y realizar búsqueda reactiva
    this.works$ = combineLatest([
      this.searchFilters$.pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
    ]).pipe(
      map(([filters]) => filters),
      map(filters => {
        // Aquí se haría la llamada al servicio de búsqueda
        return this.academicWorkService.searchWorks(filters);
      }),
      map(searchObservable => searchObservable)
    ).pipe(
      map(() => this.academicWorkService.getPublicWorks())
    ).pipe(
      map(worksObs => worksObs)
    );

    // Inicializar con búsqueda vacía
    this.performSearch();
  }

  // Métodos de búsqueda y filtrado
  onSearchTermChange(): void {
    this.updateFilters();
  }

  onCategoryChange(): void {
    this.updateFilters();
  }

  onSemesterChange(): void {
    this.updateFilters();
  }

  onYearChange(): void {
    this.updateFilters();
  }

  onSubjectChange(): void {
    this.updateFilters();
  }

  private updateFilters(): void {
    const filters: SearchFilters = {
      searchTerm: this.searchTerm || undefined,
      category: this.selectedCategory || undefined,
      semester: this.selectedSemester || undefined,
      year: this.selectedYear || undefined,
      subject: this.selectedSubject || undefined
    };
    
    this.searchFilters$.next(filters);
    this.performSearch();
  }

  private performSearch(): void {
    this.isLoading = true;
    const currentFilters = this.searchFilters$.value;
    
    this.works$ = this.academicWorkService.searchWorks(currentFilters).pipe(
      map(works => {
        this.isLoading = false;
        return this.sortWorks(works);
      })
    );
  }

  private sortWorks(works: AcademicWork[]): AcademicWork[] {
    switch (this.sortBy) {
      case 'recent':
        return works.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
      case 'popular':
        return works.sort((a, b) => b.downloadCount - a.downloadCount);
      case 'title':
        return works.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return works;
    }
  }

  // Métodos de UI
  changeSortBy(sortBy: 'recent' | 'popular' | 'title'): void {
    this.sortBy = sortBy;
    this.performSearch();
  }

  changeViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedSemester = '';
    this.selectedYear = null;
    this.selectedSubject = '';
    this.searchFilters$.next({});
    this.performSearch();
  }

  // Navegación
  viewWorkDetail(workId: string): void {
    this.router.navigate(['/library/work', workId]);
  }

  openUploadForm(): void {
    this.router.navigate(['/library/upload']);
  }

  // Métodos auxiliares
  downloadWork(work: AcademicWork): void {
    // Incrementar contador de descargas
    this.academicWorkService.incrementDownloadCount(work.id).subscribe();
    
    // Simular descarga del primer archivo
    if (work.files.length > 0) {
      const link = document.createElement('a');
      link.href = work.files[0].url;
      link.download = work.files[0].name;
      link.click();
    }
  }

  getFileTypeIcon(fileType: string): string {
    switch (fileType) {
      case 'pdf':
        return '📄';
      case 'code':
        return '💻';
      case 'documentation':
        return '📝';
      case 'presentation':
        return '📊';
      default:
        return '📁';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
