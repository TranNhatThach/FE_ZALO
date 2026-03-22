import { useQuery, useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { QUERY_KEYS } from '../api/queryKeys';

// ---------------------------------------------------------------------------
// useGetMe
// ---------------------------------------------------------------------------
interface UseGetMeOptions {
  /** Control whether the query fires (e.g., only when authenticated) */
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

// ---------------------------------------------------------------------------
// useLoginMutation
// ---------------------------------------------------------------------------
export function useLoginMutation() {
  return useMutation({
    mutationFn: authApi.login,
  });
}
