import { useEffect } from 'react';

export const usePerformanceMonitor = () => {
  useEffect(() => {
    // Monitor performance metrics
    if ('performance' in window && 'PerformanceObserver' in window) {
      // First Contentful Paint, Largest Contentful Paint
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'paint') {
            console.log(`${entry.name}: ${entry.startTime}ms`);
          }
          if (entry.entryType === 'largest-contentful-paint') {
            console.log(`LCP: ${entry.startTime}ms`);
          }
        }
      });

      try {
        paintObserver.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
      } catch (e) {
        // Fallback for browsers that don't support these entry types
        paintObserver.observe({ entryTypes: ['paint'] });
      }

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            console.log(`CLS: ${clsValue}`);
          }
        }
      });

      try {
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        console.log('Layout shift observation not supported');
      }

      // First Input Delay / Total Blocking Time proxy
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`FID: ${(entry as any).processingStart - entry.startTime}ms`);
        }
      });

      try {
        fidObserver.observe({ type: 'first-input', buffered: true });
      } catch (e) {
        console.log('First input observation not supported');
      }

      return () => {
        paintObserver.disconnect();
        clsObserver.disconnect();
        fidObserver.disconnect();
      };
    }
  }, []);
};

// Helper to measure component render time
export const measureRenderTime = (componentName: string) => {
  const startTime = performance.now();
  return () => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    if (renderTime > 16) {
      // More than one frame (60fps)
      console.warn(`${componentName} took ${renderTime.toFixed(2)}ms to render`);
    }
  };
};