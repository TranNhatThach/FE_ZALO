/**
 * =======================================================
 * MOCK API CHO TASKS — CHỈ DÙNG ĐỂ TEST FRONTEND
 * =======================================================
 * Khi backend đã ready, xóa file này và bỏ import ở task.api.ts
 */

import { Task, TaskStatus } from '../../types/task.types';

// ─── Dữ liệu giả lập ─────────────────────────────────────────────────────────
let mockTasks: Task[] = [
  {
    id: '1',
    title: 'Thiết kế Campaign Social Media cho sự kiện Tech-Day',
    category: 'MARKETING',
    priority: 'HIGH',
    date: '15 Oct',
    status: 'TO DO',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Annie',
    assigneeName: 'Annie',
  },
  {
    id: '2',
    title: 'Fix lỗi hiển thị trên Zalo Mini App phiên bản iOS',
    category: 'TECHNICAL',
    priority: 'MEDIUM',
    date: '12 Oct',
    status: 'TO DO',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Bob',
    assigneeName: 'Bob',
  },
  {
    id: '3',
    title: 'UI/UX Review Dashboard mới',
    category: 'DESIGN',
    priority: 'LOW',
    date: '10 Oct',
    status: 'IN PROGRESS',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Cindy',
    assigneeName: 'Cindy',
  },
  {
    id: '4',
    title: 'Viết unit test cho module thanh toán',
    category: 'TECHNICAL',
    priority: 'HIGH',
    date: '18 Oct',
    status: 'TO DO',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=David',
    assigneeName: 'David',
  },
  {
    id: '5',
    title: 'Tạo landing page cho chiến dịch khuyến mãi tháng 10',
    category: 'DESIGN',
    priority: 'MEDIUM',
    date: '20 Oct',
    status: 'DONE',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Eva',
    assigneeName: 'Eva',
  },
];

// ─── Giả lập delay mạng (300-600ms) ───────────────────────────────────────────
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const randomDelay = () => delay(300 + Math.random() * 300);

// ─── Mock API functions ────────────────────────────────────────────────────────

/** GET /v1/tasks/my-tasks */
export async function mockGetMyTasks(): Promise<Task[]> {
  await randomDelay();
  // Trả về shallow copy để không bị mutation
  return mockTasks.map((t) => ({ ...t }));
}

/** PUT /v1/tasks/:taskId/status */
export async function mockUpdateTaskStatus({
  taskId,
  status,
}: {
  taskId: string;
  status: TaskStatus;
}): Promise<Task> {
  await randomDelay();

  const index = mockTasks.findIndex((t) => t.id === taskId);
  if (index === -1) {
    throw new Error(`Task with id "${taskId}" not found`);
  }

  // Cập nhật status
  mockTasks[index] = { ...mockTasks[index], status };

  return { ...mockTasks[index] };
}
