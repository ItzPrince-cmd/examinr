import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Course, Category } from '../../types';
import courseService from '../../services/courseService';

interface CourseState {
  courses: Course[];
  categories: Category[];
  selectedCourse: Course | null;
  enrolledCourses: Course[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const initialState: CourseState = {
  courses: [],
  categories: [],
  selectedCourse: null,
  enrolledCourses: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  }
};

// Async thunks
export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async ({
    page = 1,
    limit = 10,
    category = '',
    search = ''
  }: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }) => {
    const response = await courseService.getCourses({ page, limit, category, search });
    return response.data;
  }
);

export const fetchCourseById = createAsyncThunk(
  'courses/fetchCourseById',
  async (courseId: string) => {
    const response = await courseService.getCourseById(courseId);
    return response.data;
  }
);

export const fetchCategories = createAsyncThunk('courses/fetchCategories', async () => {
  const response = await courseService.getCategories();
  return response.data;
});

export const fetchEnrolledCourses = createAsyncThunk('courses/fetchEnrolledCourses', async () => {
  const response = await courseService.getEnrolledCourses();
  return response.data;
});

export const enrollInCourse = createAsyncThunk(
  'courses/enrollInCourse',
  async (courseId: string) => {
    const response = await courseService.enrollInCourse(courseId);
    return response.data;
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedCourse: (state) => {
      state.selectedCourse = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Courses
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.courses = action.payload.courses;
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch courses';
      });

    // Fetch Course By Id
    builder
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.selectedCourse = action.payload;
        }
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch course';
      });

    // Fetch Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.categories = action.payload;
        }
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      });

    // Fetch Enrolled Courses
    builder
      .addCase(fetchEnrolledCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.enrolledCourses = action.payload;
        }
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch enrolled courses';
      });

    // Enroll In Course
    builder
      .addCase(enrollInCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.enrolledCourses.push(action.payload);
        }
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to enroll in course';
      });
  }
});

export const { clearError, clearSelectedCourse } = courseSlice.actions;

export default courseSlice.reducer;