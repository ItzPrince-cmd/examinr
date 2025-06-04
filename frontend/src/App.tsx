import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import AppRoutes from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './components/theme/theme-provider';
import { DesignSystemProvider } from './design-system/theme-context';
import { LayoutProvider } from './contexts/LayoutContext';
import './index.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <DesignSystemProvider>
        <ThemeProvider defaultTheme="dark" storageKey="examinr-ui-theme">
          <LayoutProvider>
            <AuthProvider>
              <AppRoutes />
              <Toaster />
            </AuthProvider>
          </LayoutProvider>
        </ThemeProvider>
      </DesignSystemProvider>
    </BrowserRouter>
  );
};

export default App;
