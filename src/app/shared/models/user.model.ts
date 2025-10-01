export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'professor' | 'admin';
  studentId?: string; // Código estudiantil
  semester?: string;
  program?: string; // Programa académico
  profileImage?: string;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  uploadedWorks: string[]; // IDs de trabajos subidos
  favoriteWorks: string[]; // IDs de trabajos favoritos
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  studentId?: string;
  semester?: string;
  program?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}