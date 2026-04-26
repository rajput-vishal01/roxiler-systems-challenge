import axios from "axios";
import { useAuthStore } from "../store/authStore";

const getBaseURL = () => {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_AXIOS_BASE_URL;
  }
  return import.meta.env.VITE_API_AXIOS_BASE_URL || "http://localhost:5000/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

// attach access token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// flag to prevent multiple refresh calls at same time
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // only attempt refresh on 401 and if not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      // if already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // attempt token refresh
        const res = await api.post("/auth/refresh-token");
        const { accessToken } = res.data;

        // update store with new token
        const { user } = useAuthStore.getState();
        useAuthStore.getState().setAuth(user, accessToken);

        // update header and retry all queued requests
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        // refresh failed — clear auth and redirect to login
        processQueue(refreshError, null);
        useAuthStore.getState().clearAuth();

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
