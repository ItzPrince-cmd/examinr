import api from './api';
import { Course, Category, ApiResponse, PaginatedResponse } from '../types';

interface CoursesResponse {
  courses: Course[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const courseService = {
  getCourses: async (params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    level?: string;
  }): Promise<ApiResponse<CoursesResponse>> => {
    const response = await api.get('/courses', { params });
    return response.data;
  },

  getCourseById: async (courseId: string): Promise<ApiResponse<Course>> => {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  },

  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    const response = await api.get('/categories');
    return response.data;
  },

  getCategoryById: async (categoryId: string): Promise<ApiResponse<Category>> => {
    const response = await api.get(`/categories/${categoryId}`);
    return response.data;
  },

  getEnrolledCourses: async (): Promise<ApiResponse<Course[]>> => {
    const response = await api.get('/courses/enrolled');
    return response.data;
  },

  enrollInCourse: async (courseId: string): Promise<ApiResponse<Course>> => {
    const response = await api.post(`/courses/${courseId}/enroll`);
    return response.data;
  },

  getCourseProgress: async (courseId: string): Promise<ApiResponse<{
    courseId: string;
    progress: number;
    completedQuizzes: string[];
    lastAccessed: string;
  }>> => {
    const response = await api.get(`/courses/${courseId}/progress`);
    return response.data;
  },

  searchCourses: async (query: string): Promise<ApiResponse<Course[]>> => {
    const response = await api.get('/courses/search', { params: { q: query } });
    return response.data;
  },

  getRecommendedCourses: async (): Promise<ApiResponse<Course[]>> => {
    const response = await api.get('/courses/recommended');
    return response.data;
  },

  rateCourse: async (courseId: string, rating: number): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post(`/courses/${courseId}/rate`, { rating });
    return response.data;
  }
};

export default courseService;