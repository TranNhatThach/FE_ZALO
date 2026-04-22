import { fetchData } from './fetcher';

export interface EmployeeProgress {
    userId: number;
    fullName: string;
    avatar: string;
    totalTasks: number;
    doneTasks: number;
    completionPercentage: number;
}

export interface ProgressReportResponse {
    totalTasks: number;
    todoTasks: number;
    inProgressTasks: number;
    doneTasks: number;
    completionPercentage: number;
    employeeProgresses?: EmployeeProgress[];
}

export const reportApi = {
    getMyProgress: (): Promise<ProgressReportResponse> =>
        fetchData<ProgressReportResponse>('/v1/reports/my-progress'),

    getTenantProgress: (): Promise<ProgressReportResponse> =>
        fetchData<ProgressReportResponse>('/v1/reports/tenant-progress'),
};
