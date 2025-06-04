import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, ApiResponse } from '../../types';
import authService from '../../services/authService';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: false,
  loading: false,
  error: null
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await authService.login(email, password);
    return response.data;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({
    name,
    email,
    password,
    role
  }: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    // Split name into firstName and lastName
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ') || '';
    
    const response = await authService.register(
      email,
      password,
      firstName,
      lastName,
      role
    );
    return response.data;
  }
);

export const loadUser = createAsyncThunk('auth/loadUser', async () => {
  const response = await authService.getProfile();
  return response.data;
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

export const refreshToken = createAsyncThunk('auth/refreshToken', async () => {
  const response = await authService.refreshToken();
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    }
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('refreshToken', action.payload.refreshToken);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('refreshToken', action.payload.refreshToken);
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      });

    // Load User
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        if (action.payload) {
          state.user = action.payload;
        }
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    });

    // Refresh Token
    builder
      .addCase(refreshToken.fulfilled, (state, action) => {
        if (action.payload) {
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('refreshToken', action.payload.refreshToken);
        }
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      });
  }
});

export const { clearError, updateUser } = authSlice.actions;

export default authSlice.reducer;