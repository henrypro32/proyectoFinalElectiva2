export interface AdminStats {
  totalUsers: number;
  totalWorks: number;
  pendingApprovals: number;
  totalDownloads: number;
  monthlyStats: {
    uploads: number;
    downloads: number;
    newUsers: number;
  };
  popularWorks: {
    id: string;
    title: string;
    downloads: number;
    author: string;
  }[];
  categoryStats: {
    categoryName: string;
    workCount: number;
    downloadCount: number;
  }[];
}

export interface ModerationAction {
  id: string;
  workId: string;
  workTitle: string;
  action: 'approve' | 'reject';
  reason?: string;
  moderatorId: string;
  moderatorName: string;
  date: Date;
}

export interface SystemSettings {
  maxFileSize: number; // en MB
  allowedFileTypes: string[];
  requireApproval: boolean;
  maintenanceMode: boolean;
  announcements: Announcement[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}