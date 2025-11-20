// src/app/shared/models/models.ts
export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  rol: string;
  fecha_registro?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  nombre: string;
  password: string;
  rol?: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface Proyecto {
  id: string;
  titulo: string;
  descripcion: string;
  archivo_url: string;
  tipo_archivo: string;
  tamano_archivo: number;
  semestre: string;
  anio: number;
  profesor: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  descargas: number;
  vistas: number;
  usuario_id: string;
  materia_id: string;
}

export interface CrearProyectoRequest {
  titulo: string;
  descripcion: string;
  archivo_url: string;
  tipo_archivo: string;
  tamano_archivo: number;
  semestre: string;
  anio: number;
  profesor: string;
  materia_id: string;
}

export interface Materia {
  id: string;
  nombre: string;
  descripcion: string;
}

export interface Estadisticas {
  total_proyectos: number;
  total_usuarios: number;
  total_materias: number;
}

export interface UploadUrlResponse {
  upload_url: string;
  archivo_url: string;
}