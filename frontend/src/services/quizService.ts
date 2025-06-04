import api from './api';
import { Quiz, QuizResult, ApiResponse } from '../types';

const quizService = {
  getQuizzesByCourse: async (courseId: string): Promise<ApiResponse<Quiz[]>> => {
    const response = await api.get(`/courses/${courseId}/quizzes`);
    return response.data;
  },

  getQuizById: async (quizId: string): Promise<ApiResponse<Quiz>> => {
    const response = await api.get(`/quizzes/${quizId}`);
    return response.data;
  },

  startQuiz: async (quizId: string): Promise<ApiResponse<Quiz>> => {
    const response = await api.post(`/quizzes/${quizId}/start`);
    return response.data;
  },

  submitQuiz: async (
    quizId: string,
    answers: { [questionId: string]: string | number }
  ): Promise<ApiResponse<QuizResult>> => {
    const response = await api.post(`/quizzes/${quizId}/submit`, { answers });
    return response.data;
  },

  getMyResults: async (): Promise<ApiResponse<QuizResult[]>> => {
    const response = await api.get('/results/my-results');
    return response.data;
  },

  getResultById: async (resultId: string): Promise<ApiResponse<QuizResult>> => {
    const response = await api.get(`/results/${resultId}`);
    return response.data;
  },

  getQuizStatistics: async (
    quizId: string
  ): Promise<ApiResponse<{
    averageScore: number;
    totalAttempts: number;
    passRate: number;
    topScore: number;
  }>> => {
    const response = await api.get(`/quizzes/${quizId}/statistics`);
    return response.data;
  },

  getQuestionsByQuiz: async (quizId: string): Promise<ApiResponse<Quiz['questions']>> => {
    const response = await api.get(`/quizzes/${quizId}/questions`);
    return response.data;
  },

  saveQuizProgress: async (
    quizId: string,
    progress: {
      currentQuestion: number;
      answers: { [questionId: string]: string | number };
      timeRemaining: number;
    }
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post(`/quizzes/${quizId}/save-progress`, progress);
    return response.data;
  },

  getQuizProgress: async (
    quizId: string
  ): Promise<ApiResponse<{
    currentQuestion: number;
    answers: { [questionId: string]: string | number };
    timeRemaining: number;
  }>> => {
    const response = await api.get(`/quizzes/${quizId}/progress`);
    return response.data;
  }
};

export default quizService;