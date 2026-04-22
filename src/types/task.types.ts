// ============================================================
// Task Domain Types
// ============================================================

export type TaskStatus = 'TO DO' | 'IN PROGRESS' | 'CHECKED IN' | 'REVIEW' | 'DONE';
export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: TaskPriority;
  /** Due date string, e.g. "15 Oct" or ISO format */
  date?: string;
  dueDate?: string;
  status: TaskStatus;
  /** URL of the assignee avatar */
  avatar?: string;
  assigneeId?: string;
  assigneeName?: string;
  createdAt?: string;
  updatedAt?: string;
  reportImages?: string;

  // ── Check-in fields ──
  checkInTime?: string;
  checkInLatitude?: number;
  checkInLongitude?: number;
  checkInPhoto?: string;
  checkInNote?: string;

  // ── Completion fields ──
  completionPhoto?: string;
  completionTime?: string;
  resultNote?: string;
  customerConfirmed?: boolean;
  durationMinutes?: number;
}

export interface CreateTaskRequest {
  title: string;
  category: string;
  priority: TaskPriority;
  dueDate: string;
  description?: string;
  assigneeId?: string;
}

export interface UpdateTaskStatusRequest {
  taskId: string;
  status: TaskStatus;
}

export interface TaskCheckInRequest {
  taskId: string;
  photo?: File | Blob;
  lat: number;
  lon: number;
  note?: string;
}

export interface TaskCompleteRequest {
  taskId: string;
  photo?: File | Blob;
  resultNote?: string;
  customerConfirmed?: boolean;
}

export interface TaskPageResponse {
  content: Task[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
