import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AcademicWorkService } from '../file';
import { WorkCategory, UploadRequest } from '../../shared/models/academic-work.model';
import { Auth } from '../../core/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-upload-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './upload-form.html',
  styleUrl: './upload-form.css'
})
export class UploadForm implements OnInit {
  uploadForm!: FormGroup;
  categories$!: Observable<WorkCategory[]>;
  selectedFiles: File[] = [];
  isUploading = false;
  uploadProgress = 0;
  errorMessage = '';
  successMessage = '';

  // Opciones para formulario
  semesterOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  yearOptions = [2024, 2023, 2022, 2021, 2020];
  commonSubjects = [
    'Programación Web',
    'Base de Datos',
    'Algoritmos y Estructuras de Datos',
    'Ingeniería de Software',
    'Redes de Computadores',
    'Inteligencia Artificial',
    'Sistemas Operativos',
    'Compiladores',
    'Arquitectura de Computadores',
    'Proyecto de Grado'
  ];

  allowedFileTypes = [
    '.pdf',
    '.doc',
    '.docx',
    '.ppt',
    '.pptx',
    '.zip',
    '.rar',
    '.tar.gz'
  ];

  maxFileSize = 50 * 1024 * 1024; // 50MB

  constructor(
    private fb: FormBuilder,
    private academicWorkService: AcademicWorkService,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.loadCategories();
    this.checkUserAuthentication();
  }

  private createForm(): void {
    this.uploadForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
      subject: ['', Validators.required],
      semester: ['', Validators.required],
      professor: ['', [Validators.required, Validators.minLength(3)]],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(2020), Validators.max(2030)]],
      categoryId: ['', Validators.required],
      tags: [''],
      agreementAccepted: [false, Validators.requiredTrue]
    });
  }

  private loadCategories(): void {
    this.categories$ = this.academicWorkService.categories$;
  }

  private checkUserAuthentication(): void {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
    }
  }

  // Manejo de archivos
  onFileSelected(event: any): void {
    const files = Array.from(event.target.files) as File[];
    this.selectedFiles = [];
    this.errorMessage = '';

    for (const file of files) {
      if (this.validateFile(file)) {
        this.selectedFiles.push(file);
      }
    }

    // Actualizar el input visual
    this.updateFileDisplay();
  }

  private validateFile(file: File): boolean {
    // Validar tamaño
    if (file.size > this.maxFileSize) {
      this.errorMessage = `El archivo "${file.name}" excede el tamaño máximo de 50MB`;
      return false;
    }

    // Validar tipo
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!this.allowedFileTypes.includes(fileExtension)) {
      this.errorMessage = `El archivo "${file.name}" no tiene un formato permitido`;
      return false;
    }

    return true;
  }

  private updateFileDisplay(): void {
    const fileInput = document.getElementById('files') as HTMLInputElement;
    if (fileInput) {
      const dt = new DataTransfer();
      this.selectedFiles.forEach(file => dt.items.add(file));
      fileInput.files = dt.files;
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.updateFileDisplay();
  }

  // Envío del formulario
  onSubmit(): void {
    if (this.uploadForm.valid && this.selectedFiles.length > 0) {
      this.isUploading = true;
      this.errorMessage = '';
      this.uploadProgress = 0;

      const formValue = this.uploadForm.value;
      const tags = formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()) : [];

      const uploadData: UploadRequest = {
        title: formValue.title,
        description: formValue.description,
        subject: formValue.subject,
        semester: formValue.semester,
        professor: formValue.professor,
        year: formValue.year,
        categoryId: formValue.categoryId,
        tags: tags,
        files: this.selectedFiles
      };

      // Simular progreso de subida
      this.simulateUploadProgress();

      this.academicWorkService.uploadWork(uploadData).subscribe({
        next: (response) => {
          this.successMessage = '¡Trabajo subido exitosamente! Está pendiente de aprobación.';
          this.isUploading = false;
          this.uploadProgress = 100;
          
          // Redirect después de 3 segundos
          setTimeout(() => {
            this.router.navigate(['/library']);
          }, 3000);
        },
        error: (error) => {
          this.errorMessage = error.message || 'Error al subir el trabajo';
          this.isUploading = false;
          this.uploadProgress = 0;
        }
      });
    } else {
      this.markFormGroupTouched();
      if (this.selectedFiles.length === 0) {
        this.errorMessage = 'Debes seleccionar al menos un archivo';
      }
    }
  }

  private simulateUploadProgress(): void {
    const interval = setInterval(() => {
      this.uploadProgress += Math.random() * 15;
      if (this.uploadProgress >= 90) {
        this.uploadProgress = 90;
        clearInterval(interval);
      }
    }, 200);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.uploadForm.controls).forEach(key => {
      const control = this.uploadForm.get(key);
      control?.markAsTouched();
    });
  }

  // Métodos auxiliares para validación
  isFieldInvalid(fieldName: string): boolean {
    const field = this.uploadForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.uploadForm.get(fieldName);
    
    if (field?.errors) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} es requerido`;
      }
      if (field.errors['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldLabel(fieldName)} debe tener al menos ${minLength} caracteres`;
      }
      if (field.errors['maxlength']) {
        const maxLength = field.errors['maxlength'].requiredLength;
        return `${this.getFieldLabel(fieldName)} no puede exceder ${maxLength} caracteres`;
      }
      if (field.errors['min']) {
        return `Año mínimo: ${field.errors['min'].min}`;
      }
      if (field.errors['max']) {
        return `Año máximo: ${field.errors['max'].max}`;
      }
    }
    
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      title: 'Título',
      description: 'Descripción',
      subject: 'Materia',
      semester: 'Semestre',
      professor: 'Profesor',
      year: 'Año',
      categoryId: 'Categoría',
      agreementAccepted: 'Aceptación de términos'
    };
    
    return labels[fieldName] || fieldName;
  }

  // Métodos auxiliares
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileIcon(file: File): string {
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'ppt':
      case 'pptx':
        return '📊';
      case 'zip':
      case 'rar':
        return '📦';
      default:
        return '📁';
    }
  }

  cancel(): void {
    this.router.navigate(['/library']);
  }
}
