import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import courseReducer from './slices/courseSlice';
import quizReducer from './slices/quizSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    quiz: quizReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types ignoredActions: ['auth/login/fulfilled','auth/register/fulfilled'],// Ignore these field paths in all actions ignoredActionPaths: ['meta.arg','payload.timestamp'],// Ignore these paths in the state ignoredPaths: ['auth.user'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
