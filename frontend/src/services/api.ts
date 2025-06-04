import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig
} from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For CSRF cookie
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Get CSRF token from cookie if available
    const csrfToken = document.cookie
      .split(';')
      .find((row) => row.startsWith('csrf-token='))
      ?.split('=')[1];
      
    if (csrfToken && config.headers) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (!error.response) {
      // Network error
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    // Handle 401 errors (Unauthorized) - redirect to login
    if (error.response.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    
    // Handle other errors
    const errorData = error.response.data as any;
    const errorMessage = errorData?.message || errorData?.error || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;