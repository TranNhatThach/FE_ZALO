import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../api/task.api';
import { QUERY_KEYS } from '../api/queryKeys';
import { TaskStatus } from '../types/task.types';

/**
 * Hook lấy danh sách task của người dùng hiện tại.
 * Gọi GET /v1/tasks/my-tasks thông qua custom fetcher (có auto token refresh).
 */
export function useGetMyTasks() {
  return useQuery({
    queryKey: QUERY_KEYS.TASKS.MY_TASKS,
    queryFn: taskApi.getMyTasks,
    // Không retry khi fail để tránh spam request khi backend trả 401
    retry: 1,
  });
}

/**
 * Mutation hook cập nhật trạng thái của một task.
 * Sau khi thành công, tự động invalidate cache MY_TASKS để làm mới danh sách.
 */
export function useUpdateTaskStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      taskApi.updateStatus({ taskId, status }),

    onSuccess: () => {
      // Invalidate & refetch danh sách task để UI cập nhật tức thì
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
