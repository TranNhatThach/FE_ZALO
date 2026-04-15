import { useAuthStore } from '../stores/auth.store';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const ACCESS_TOKEN_KEY = 'zma_access_token';
const REFRESH_TOKEN_KEY = 'zma_refresh_token';

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

export async function fetchData<T>(
  endpoint: string,
  options: RequestInit & { _retry?: boolean } = {}
): Promise<T> {
  const { _retry = false, ...fetchOptions } = options;

  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  const tenantId = localStorage.getItem('tenant_id') || 'default';

  const isFormData = fetchOptions.body instanceof FormData;
  const headers: Record<string, string> = {
    'X-Tenant-Id': tenantId,
    ...(fetchOptions.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (!isFormData) {
    if (!headers['Content-Type']) headers['Content-Type'] = 'application/json';
  } else {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (response.status === 401 && !_retry) {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      useAuthStore.getState().logout();
      throw new Error('Unauthorized');
    }

    if (isRefreshing) {
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
      const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshResponse.ok) {
        throw new Error('Token refresh failed');
      }

      const refreshData = (await refreshResponse.json()) as { accessToken: string };
      const newToken = refreshData.accessToken;

      localStorage.setItem(ACCESS_TOKEN_KEY, newToken);
      useAuthStore.setState({ accessToken: newToken });

      flushQueue(null, newToken);

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

  if (!response.ok) {
    let errorMessage = `Error ${response.status}`;
    try {
      const errBody = (await response.json()) as { message?: string; error?: string };
      errorMessage = errBody.message ?? errBody.error ?? errorMessage;
    } catch {
      // Body not JSON
    }
    throw new Error(errorMessage);
  }

  const json = (await response.json()) as { data?: T } | T;

  if (json !== null && typeof json === 'object' && 'data' in json) {
    return (json as { data: T }).data;
  }
  return json as T;
}

export const api = {
  get<T>(url: string, options?: RequestInit): Promise<T> {
    return fetchData<T>(url, { ...options, method: 'GET' });
  },

  post<T>(url: string, body: unknown, options?: RequestInit): Promise<T> {
    const isFormData = body instanceof FormData;
    return fetchData<T>(url, {
      ...options,
      method: 'POST',
      body: isFormData ? (body as BodyInit) : JSON.stringify(body),
    });
  },

  put<T>(url: string, body: unknown, options?: RequestInit): Promise<T> {
    const isFormData = body instanceof FormData;
    return fetchData<T>(url, {
      ...options,
      method: 'PUT',
      body: isFormData ? (body as BodyInit) : JSON.stringify(body),
    });
  },

  patch<T>(url: string, body: unknown, options?: RequestInit): Promise<T> {
    const isFormData = body instanceof FormData;
    return fetchData<T>(url, {
      ...options,
      method: 'PATCH',
      body: isFormData ? (body as BodyInit) : JSON.stringify(body),
    });
  },

  del<T>(url: string, options?: RequestInit): Promise<T> {
    return fetchData<T>(url, { ...options, method: 'DELETE' });
  },
};
