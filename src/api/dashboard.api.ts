import { api } from './fetcher';
import { ApiResponse } from '../types';

export interface DashboardSummary {
  totalEmployees: number;
  todayAttendance: number;
  pendingTasks: number;
  totalProducts: number;
  inventoryValue: number;
  operationalEfficiency: number;
  weeklyActivity: { day: string; value: number }[];
  recentTasks: any[]; // You can define a Task interface if you have one
}

export const dashboardApi = {
  getSummary: (): Promise<DashboardSummary> => 
    api.get<DashboardSummary>('/v1/dashboard/summary'),
};
