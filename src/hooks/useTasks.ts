import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../api/task.api';
import { QUERY_KEYS } from '../api/queryKeys';
import { TaskStatus, TaskCheckInRequest, TaskCompleteRequest } from '../types/task.types';

/**
 * Hook lấy danh sách task của người dùng hiện tại.
 */
export function useGetMyTasks() {
  return useQuery({
    queryKey: QUERY_KEYS.TASKS.MY_TASKS,
    queryFn: taskApi.getMyTasks,
    retry: 1,
  });
}

/**
 * Hook lấy toàn bộ công việc của doanh nghiệp (Dành cho Admin).
 */
export function useGetTasksByTenant(tenantId?: string | number, page = 0, size = 10) {
  return useQuery({
    queryKey: [QUERY_KEYS.TASKS.MY_TASKS, 'tenant', tenantId, page, size],
    queryFn: () => taskApi.getTasksByTenant(tenantId!, page, size),
    enabled: !!tenantId,
    retry: 1,
  });
}

/**
 * Hook lấy danh sách task chưa giao cho ai.
 */
export function useGetUnassignedTasks() {
  return useQuery({
    queryKey: [QUERY_KEYS.TASKS.MY_TASKS, 'unassigned'],
    queryFn: taskApi.getUnassignedTasks,
    retry: 1,
  });
}

/**
 * Mutation hook cập nhật trạng thái của một task.
 */
export function useUpdateTaskStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      taskApi.updateStatus({ taskId, status }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS.MY_TASKS });
    },
  });
}

/**
 * Mutation hook check-in công việc.
 */
export function useTaskCheckInMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TaskCheckInRequest) => taskApi.checkIn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS.MY_TASKS });
    },
  });
}

/**
 * Mutation hook hoàn thành công việc.
 */
export function useTaskCompleteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TaskCompleteRequest) => taskApi.complete(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS.MY_TASKS });
    },
  });
}

/**
 * Mutation hook nhận task chưa giao.
 */
export function useClaimTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => taskApi.claimTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS.MY_TASKS });
    },
  });
}

/**
 * Mutation hook để tạo task mới.
 */
export function useCreateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => taskApi.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS.MY_TASKS });
    },
  });
}

/**
 * Mutation hook để xóa task.
 */
export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string | number) => taskApi.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS.MY_TASKS });
    },
  });
}

/**
 * Mutation hook để Admin phê duyệt task.
 */
export function useApproveTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, note }: { taskId: string | number; note?: string }) =>
      taskApi.approve(taskId, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS.MY_TASKS });
    },
  });
}

/**
 * Mutation hook để Admin từ chối task.
 */
export function useRejectTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, reason }: { taskId: string | number; reason: string }) =>
      taskApi.reject(taskId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS.MY_TASKS });
    },
  });
}
