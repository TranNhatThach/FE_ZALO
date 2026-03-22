import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuthStore } from '../../stores/auth.store';

// Set up base API URL depending on environment
const API_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Access Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('zma_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`; // Authorization header
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor variables
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void; }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If refreshing, pause this request until refresh gets completed
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = Cookies.get('zma_refresh_token');
      if (!refreshToken) {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      try {
        // Refresh token API call
        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        
        Cookies.set('zma_access_token', data.accessToken, { secure: import.meta.env.PROD, sameSite: 'strict' });
        useAuthStore.setState({ accessToken: data.accessToken });
        
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        processQueue(null, data.accessToken);
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout(); // Logout user if refresh fails
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
