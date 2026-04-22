import { useQuery } from '@tanstack/react-query';
import { reportApi } from '@/api/report.api';

export const useGetMyProgress = () => {
    return useQuery({
        queryKey: ['my-progress'],
        queryFn: () => reportApi.getMyProgress(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useGetTenantProgress = () => {
    return useQuery({
        queryKey: ['tenant-progress'],
        queryFn: () => reportApi.getTenantProgress(),
        staleTime: 5 * 60 * 1000,
    });
};
