import { useQuery, useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { QUERY_KEYS } from '../api/queryKeys';

interface UseGetMeOptions {
  enabled?: boolean;
}

export function useGetMe(options: UseGetMeOptions = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.AUTH.ME,
    queryFn: authApi.getMe,
    retry: false,
    ...options,
  });
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: authApi.loginBasic,
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: authApi.register,
  });
}

export function useZaloLoginMutation() {
  return useMutation({
    mutationFn: authApi.zaloLogin,
  });
}
