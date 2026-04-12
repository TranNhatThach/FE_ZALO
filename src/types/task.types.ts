// ============================================================
// Task Domain Types
// ============================================================

export type TaskStatus = 'TO DO' | 'IN PROGRESS' | 'DONE';
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

export interface TaskPageResponse {
  content: Task[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
