import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Quiz, QuizResult, Question } from '../../types';
import quizService from '../../services/quizService';

interface QuizState {
  quizzes: Quiz[];
  activeQuiz: Quiz | null;
  currentQuestion: number;
  answers: { [questionId: string]: string | number };
  quizResult: QuizResult | null;
  results: QuizResult[];
  loading: boolean;
  error: string | null;
  timeRemaining: number | null;
}

const initialState: QuizState = {
  quizzes: [],
  activeQuiz: null,
  currentQuestion: 0,
  answers: {},
  quizResult: null,
  results: [],
  loading: false,
  error: null,
  timeRemaining: null
};

// Async thunks
export const fetchQuizzesByCourse = createAsyncThunk(
  'quiz/fetchQuizzesByCourse',
  async (courseId: string) => {
    const response = await quizService.getQuizzesByCourse(courseId);
    return response.data;
  }
);

export const fetchQuizById = createAsyncThunk(
  'quiz/fetchQuizById',
  async (quizId: string) => {
    const response = await quizService.getQuizById(quizId);
    return response.data;
  }
);

export const startQuiz = createAsyncThunk(
  'quiz/startQuiz',
  async (quizId: string) => {
    const response = await quizService.startQuiz(quizId);
    return response.data;
  }
);

export const submitQuiz = createAsyncThunk(
  'quiz/submitQuiz',
  async ({
    quizId,
    answers
  }: {
    quizId: string;
    answers: { [questionId: string]: string | number };
  }) => {
    const response = await quizService.submitQuiz(quizId, answers);
    return response.data;
  }
);

export const fetchQuizResults = createAsyncThunk('quiz/fetchQuizResults', async () => {
  const response = await quizService.getMyResults();
  return response.data;
});

export const fetchQuizResult = createAsyncThunk(
  'quiz/fetchQuizResult',
  async (resultId: string) => {
    const response = await quizService.getResultById(resultId);
    return response.data;
  }
);

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentQuestion: (state, action: PayloadAction<number>) => {
      state.currentQuestion = action.payload;
    },
    setAnswer: (state, action: PayloadAction<{ questionId: string; answer: string | number }>) => {
      if (action.payload) {
        state.answers[action.payload.questionId] = action.payload.answer;
      }
    },
    setTimeRemaining: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload;
    },
    resetQuiz: (state) => {
      state.activeQuiz = null;
      state.currentQuestion = 0;
      state.answers = {};
      state.quizResult = null;
      state.timeRemaining = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Quizzes By Course
    builder
      .addCase(fetchQuizzesByCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizzesByCourse.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.quizzes = action.payload;
        }
      })
      .addCase(fetchQuizzesByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch quizzes';
      });

    // Fetch Quiz By Id
    builder
      .addCase(fetchQuizById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.activeQuiz = action.payload;
        }
      })
      .addCase(fetchQuizById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch quiz';
      });

    // Start Quiz
    builder
      .addCase(startQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startQuiz.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.activeQuiz = action.payload;
          state.timeRemaining = action.payload.duration * 60; // Convert to seconds
          state.currentQuestion = 0;
          state.answers = {};
        }
      })
      .addCase(startQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to start quiz';
      });

    // Submit Quiz
    builder
      .addCase(submitQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.quizResult = action.payload;
        }
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to submit quiz';
      });

    // Fetch Quiz Results
    builder
      .addCase(fetchQuizResults.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuizResults.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.results = action.payload;
        }
      })
      .addCase(fetchQuizResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch results';
      });

    // Fetch Quiz Result
    builder
      .addCase(fetchQuizResult.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuizResult.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.quizResult = action.payload;
        }
      })
      .addCase(fetchQuizResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch result';
      });
  }
});

export const {
  clearError,
  setCurrentQuestion,
  setAnswer,
  setTimeRemaining,
  resetQuiz
} = quizSlice.actions;

export default quizSlice.reducer;