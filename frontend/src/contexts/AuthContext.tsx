import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'instructor' | 'admin';
  avatar?: string;
  practiceStreak?: number;
  dailyProgress?: number;
  dailyGoal?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session in localStorage
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
          const user = JSON.parse(storedUser);

          // Ensure the stored user has a role
          if (!user.role) {
            throw new Error('Invalid user data');
          }

          setUser(user);

          // Set default authorization headerapi.defaults.headers.common['Authorization'] =
          `Bearer ${storedToken}`;

          // Verify token is still valid
          try {
            const verifyResponse = await api.get('/auth/verify');

            if (verifyResponse.data.success && verifyResponse.data.user) {
              // Update user data from server
              const serverUser = verifyResponse.data.user;
              const updatedUser = {
                ...serverUser,
                name:
                  serverUser.name ||
                  serverUser.fullName ||
                  `${serverUser.firstName} ${serverUser.lastName}`,
              };

              setUser(updatedUser);
              localStorage.setItem('user', JSON.stringify(updatedUser));
            }
          } catch (error) {
            // Token is invalid, clear stored dataconsole.error('Token verification failed:', error);localStorage.removeItem('user');localStorage.removeItem('token');localStorage.removeItem('refreshToken');delete api.defaults.headers.common['Authorization'];
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response.data);
      console.log('Response structure:', {
        hasUser: !!response.data.user,
        userRole: response.data.user?.role,
        fullUser: response.data.user,
      });

      const { user, accessToken, refreshToken } = response.data;

      // Ensure we have the user object with role
      if (!user || !user.role) {
        console.error('Invalid user data:', user);
        throw new Error('Invalid response from server');
      }
      console.log('User role:', user.role);

      // Ensure user has name field
      const userWithName = {
        ...user,
        name: user.name || user.fullName || `${user.firstName} ${user.lastName}`,
      };

      setUser(userWithName);
      localStorage.setItem('user', JSON.stringify(userWithName));
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Set default authorization header for future requestsapi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    } catch (error: any) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      delete api.defaults.headers.common['Authorization'];
    }
  }, []);

  const register = useCallback(async (userData: Partial<User> & { password: string }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/register', userData);
      const { user, token } = response.data;

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      // Set default authorization header for future requestsapi.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } catch (error: any) {
      console.error('Registration failed:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const updateProfile = useCallback(async (userData: Partial<User>) => {
    setLoading(true);

    try {
      const response = await api.put('/users/profile', userData);
      const updatedUser = response.data.user;

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error: any) {
      console.error('Profile update failed:', error);
      throw new Error(error.response?.data?.message || 'Profile update failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const value: AuthContextType = useMemo(
    () => ({
      user,
      login,
      logout,
      register,
      isAuthenticated: !!user,
      loading,
      isLoading: loading,
      error,
      clearError,
      updateProfile,
    }),
    [user, login, logout, register, loading, error, clearError, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
