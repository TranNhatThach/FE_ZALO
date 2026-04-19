import { api } from './fetcher';
import { ApiResponse } from '../types';

export interface DashboardSummary {
  totalEmployees: number;
  todayAttendance: number;
  pendingTasks: number;
  totalProducts: number;
  inventoryValue: number;
}

export const dashboardApi = {
  getSummary: (): Promise<DashboardSummary> => 
    api.get<DashboardSummary>('/v1/dashboard/summary'),
};
