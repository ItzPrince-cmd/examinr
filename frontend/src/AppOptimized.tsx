import React, { Suspense, lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
// Lazy load providers to improve initial load 
const AuthProvider = lazy(() => import('./contexts/AuthContext').then(module => ({ default: module.AuthProvider })));
const ThemeProvider = lazy(() => import('./components/theme/theme-provider').then(module => ({ default: module.ThemeProvider })));
const DesignSystemProvider = lazy(() => import('./design-system/theme-context').then(module => ({ default: module.DesignSystemProvider })));
const LayoutProvider = lazy(() => import('./contexts/LayoutContext').then(module => ({ default: module.LayoutProvider })));
const Toaster = lazy(() => import('./components/ui/toaster').then(module => ({ default: module.Toaster })));
const AppRoutes = lazy(() => import('./routes'));
// Loading component 
const LoadingFallback = () => ( 
  <div className="fixed inset-0 flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4">
      </div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
  );

  const App: React.FC = () => {
  return (
    <BrowserRouter>
  <Suspense fallback={<LoadingFallback />}>
  <DesignSystemProvider><ThemeProvider defaultTheme="dark" storageKey="examinr-ui-theme">
  <LayoutProvider>
  <AuthProvider>
  <Suspense fallback={<LoadingFallback />}>
  <AppRoutes />
  </Suspense>
  <Toaster />
  </AuthProvider>
  </LayoutProvider>
  </ThemeProvider>
  </DesignSystemProvider>
  </Suspense>
  </BrowserRouter>
  )
}

export default App;
