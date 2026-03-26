import Cookies from 'js-cookie';
import { useAuthStore } from '../stores/auth.store';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const ACCESS_TOKEN_KEY = 'zma_access_token';
const REFRESH_TOKEN_KEY = 'zma_refresh_token';

// ---------------------------------------------------------------------------
// Refresh-queue mechanism (mirrors axios interceptor pattern)
// ---------------------------------------------------------------------------
let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function flushQueue(error: unknown, token: string | null = null): void {
  pendingQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(token as string);
    }
  });
  pendingQueue = [];
}

// ---------------------------------------------------------------------------
// Core fetch helper
// ---------------------------------------------------------------------------
export async function fetchData<T>(
  endpoint: string,
  options: RequestInit & { _retry?: boolean } = {}
): Promise<T> {
  const { _retry = false, ...fetchOptions } = options;

  const token = Cookies.get(ACCESS_TOKEN_KEY);
  const tenantId = localStorage.getItem('tenant_id') || 'default';

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'X-Tenant-Id': tenantId,
    ...(fetchOptions.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  // ── 401 handling ─────────────────────────────────────────────────────────
  if (response.status === 401 && !_retry) {
    const refreshToken = Cookies.get(REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      useAuthStore.getState().logout();
      throw new Error('Unauthorized — no refresh token available.');
    }

    if (isRefreshing) {
      // Queue this request until the in-flight refresh resolves
      return new Promise<T>((resolve, reject) => {
        pendingQueue.push({
          resolve: (newToken: string) => {
            resolve(
              fetchData<T>(endpoint, {
                ...options,
                _retry: true,
                headers: {
                  ...(fetchOptions.headers as Record<string, string>),
                  Authorization: `Bearer ${newToken}`,
                },
              })
            );
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      // Use plain fetch to avoid recursive fetchData call
      const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshResponse.ok) {
        throw new Error('Token refresh failed.');
      }

      const refreshData = (await refreshResponse.json()) as { accessToken: string };
      const newToken = refreshData.accessToken;

      // Persist new token
      Cookies.set(ACCESS_TOKEN_KEY, newToken, {
        secure: import.meta.env.PROD,
        sameSite: 'strict',
      });
      useAuthStore.setState({ accessToken: newToken });

      flushQueue(null, newToken);

      // Retry original request with new token
      return fetchData<T>(endpoint, {
        ...options,
        _retry: true,
        headers: {
          ...(fetchOptions.headers as Record<string, string>),
          Authorization: `Bearer ${newToken}`,
        },
      });
    } catch (refreshError) {
      flushQueue(refreshError, null);
      useAuthStore.getState().logout();
      throw refreshError;
    } finally {
      isRefreshing = false;
    }
  }

  // ── Non-401 error handling ─────────────────────────────────────────────
  if (!response.ok) {
    // Try to parse server error body for a descriptive message
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errBody = (await response.json()) as { message?: string; error?: string };
      errorMessage = errBody.message ?? errBody.error ?? errorMessage;
    } catch {
      // body is not JSON — keep default message
    }
    throw new Error(errorMessage);
  }

  // ── Parse and return response data ────────────────────────────────────
  const json = (await response.json()) as { data?: T } | T;

  // Support both wrapped { data: T } and unwrapped T responses
  if (json !== null && typeof json === 'object' && 'data' in json) {
    return (json as { data: T }).data;
  }
  return json as T;
}

// ---------------------------------------------------------------------------
// Convenience helpers
// ---------------------------------------------------------------------------
export const api = {
  get<T>(url: string, options?: RequestInit): Promise<T> {
    return fetchData<T>(url, { ...options, method: 'GET' });
  },

  post<T>(url: string, body: unknown, options?: RequestInit): Promise<T> {
    return fetchData<T>(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  put<T>(url: string, body: unknown, options?: RequestInit): Promise<T> {
    return fetchData<T>(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  del<T>(url: string, options?: RequestInit): Promise<T> {
    return fetchData<T>(url, { ...options, method: 'DELETE' });
  },
};
