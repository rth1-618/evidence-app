import axios, { InternalAxiosRequestConfig } from 'axios';

// Vite uses import.meta.env instead of process.env
const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || 'http://localhost:5000/api',
});

// Automatically attach JWT to every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
