import api from './api';
import { User, ApiResponse } from '../types';

interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

interface RegisterResponse {
  user: User;
  token: string;
  refreshToken: string;
}

const authService = {
  login: async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
    // Mock login for demo - accepts any credentials
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: email,
      role: 'student',
      avatar: 'https://bit.ly/sage-adebayo',
      createdAt: new Date().toISOString()
    };

    const mockResponse: ApiResponse<LoginResponse> = {
      success: true,
      data: {
        user: mockUser,
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token'
      }
    };

    // Store token
    localStorage.setItem('token', mockResponse.data!.token);
    localStorage.setItem('refreshToken', mockResponse.data!.refreshToken);
    
    return mockResponse;
  },

  register: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string
  ): Promise<ApiResponse<RegisterResponse>> => {
    const response = await api.post('/auth/register', {
      email,
      password,
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      role
    });

    // Store tokens if registration is successful
    if (response.data.success && response.data.data) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
    }
    
    return response.data;
  },

  logout: async (): Promise<void> => {
    // Mock logout - just clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    // Mock profile for demo
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'student',
      avatar: 'https://bit.ly/sage-adebayo',
      createdAt: new Date().toISOString()
    };

    return { success: true, data: mockUser };
  },

  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  refreshToken: async (): Promise<ApiResponse<{ token: string; refreshToken: string }>> => {
    const response = await api.post('/auth/refresh-token');
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (
    token: string,
    password: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  }
};

export default authService;