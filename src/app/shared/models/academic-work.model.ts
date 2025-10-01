export interface AcademicWork {
  id: string;
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  subject: string;
  semester: string;
  professor: string;
  year: number;
  category: WorkCategory;
  tags: string[];
  files: WorkFile[];
  uploadDate: Date;
  downloadCount: number;
  rating: number;
  reviews: Review[];
  status: 'pending' | 'approved' | 'rejected';
  isPublic: boolean;
}

export interface WorkFile {
  id: string;
  name: string;
  type: 'pdf' | 'code' | 'documentation' | 'presentation' | 'other';
  url: string;
  size: number; // en bytes
  uploadDate: Date;
}

export interface WorkCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface SearchFilters {
  subject?: string;
  semester?: string;
  professor?: string;
  year?: number;
  category?: string;
  tags?: string[];
  searchTerm?: string;
}

export interface UploadRequest {
  title: string;
  description: string;
  subject: string;
  semester: string;
  professor: string;
  year: number;
  categoryId: string;
  tags: string[];
  files: File[];
}