import { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from '../utils/debounce';

export interface WidgetPosition {
  x: number;
  y: number;
}

export interface WidgetState {
  id: string;
  isVisible: boolean;
  position: WidgetPosition;
  isMinimized?: boolean;
}

const STORAGE_KEY = 'examinr-widget-states';

// Account for sidebar (256px), top nav (80px), and bottom controls
const SIDEBAR_WIDTH = 256;
const TOP_NAV_HEIGHT = 80;
const MARGIN = 20;
const BOTTOM_SAFE_ZONE = 150;

// Keep widgets above bottom controls
const defaultPositions: Record<string, WidgetPosition> = {
  quickStats: {
    x: SIDEBAR_WIDTH + MARGIN,
    y: Math.max(200, window.innerHeight - 400)
  },
  motivationalQuote: {
    x: SIDEBAR_WIDTH + MARGIN,
    y: TOP_NAV_HEIGHT + MARGIN + 50
  },
  energyLevel: {
    x: SIDEBAR_WIDTH + 300,
    y: Math.max(200, window.innerHeight - 400)
  },
  studyBuddy: {
    x: window.innerWidth - 400,
    y: Math.max(300, window.innerHeight - 350)
  },
  achievement: {
    x: window.innerWidth / 2 - 150,
    y: TOP_NAV_HEIGHT + MARGIN
  },
  activityFeed: {
    x: window.innerWidth - 350,
    y: Math.max(250, window.innerHeight - 500)
  },
  studyTimer: {
    x: window.innerWidth - 350,
    y: TOP_NAV_HEIGHT + MARGIN + 40
  },
  upcomingEvents: {
    x: window.innerWidth - 350,
    y: TOP_NAV_HEIGHT + MARGIN + 170
  }
};

export const useWidgetManager = () => {
  const [widgetStates, setWidgetStates] = useState<Record<string, WidgetState>>(() => {
    // Load saved states from localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load widget states:', e);
      }
    }
    // Return default states
    return Object.entries(defaultPositions).reduce((acc, [id, position]) => ({
      ...acc,
      [id]: { id, isVisible: true, position, isMinimized: false }
    }), {});
  });

  // Debounced save to localStorage
  const saveToLocalStorage = useMemo(
    () => debounce((states: Record<string, WidgetState>) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
      } catch (e) {
        console.error('Failed to save widget states:', e);
      }
    }, 500),
    []
  );

  // Save states to localStorage whenever they change
  useEffect(() => {
    saveToLocalStorage(widgetStates);
  }, [widgetStates, saveToLocalStorage]);

  // Ensure widgets stay within bounds on window resize
  useEffect(() => {
    const handleResize = () => {
      setWidgetStates(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(id => {
          const widget = updated[id];
          if (widget && widget.position) {
            // Ensure widget stays within horizontal bounds
            widget.position.x = Math.max(
              SIDEBAR_WIDTH + MARGIN,
              Math.min(widget.position.x, window.innerWidth - 300)
            );
            // Ensure widget stays within vertical bounds
            widget.position.y = Math.max(
              TOP_NAV_HEIGHT + MARGIN,
              Math.min(widget.position.y, window.innerHeight - BOTTOM_SAFE_ZONE)
            );
          }
        });
        return updated;
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Debounced position update to reduce re-renders
  const updateWidgetPosition = useMemo(
    () => debounce((widgetId: string, position: WidgetPosition) => {
      setWidgetStates(prev => ({
        ...prev,
        [widgetId]: { ...prev[widgetId], position }
      }));
    }, 100),
    []
  );

  const toggleWidgetVisibility = useCallback((widgetId: string) => {
    setWidgetStates(prev => {
      const currentState = prev[widgetId] || {
        id: widgetId,
        isVisible: false,
        position: defaultPositions[widgetId] || {
          x: SIDEBAR_WIDTH + MARGIN,
          y: TOP_NAV_HEIGHT + MARGIN
        },
        isMinimized: false
      };

      return {
        ...prev,
        [widgetId]: {
          ...currentState,
          isVisible: !currentState.isVisible
        }
      };
    });
  }, []);

  const closeWidget = useCallback((widgetId: string) => {
    setWidgetStates(prev => {
      const currentState = prev[widgetId] || {
        id: widgetId,
        isVisible: true,
        position: defaultPositions[widgetId] || {
          x: SIDEBAR_WIDTH + MARGIN,
          y: TOP_NAV_HEIGHT + MARGIN
        },
        isMinimized: false
      };

      return {
        ...prev,
        [widgetId]: { ...currentState, isVisible: false }
      };
    });
  }, []);

  const openWidget = useCallback((widgetId: string) => {
    setWidgetStates(prev => {
      const currentState = prev[widgetId] || {
        id: widgetId,
        isVisible: false,
        position: defaultPositions[widgetId] || {
          x: SIDEBAR_WIDTH + MARGIN,
          y: TOP_NAV_HEIGHT + MARGIN
        },
        isMinimized: false
      };

      return {
        ...prev,
        [widgetId]: { ...currentState, isVisible: true }
      };
    });
  }, []);

  const minimizeWidget = useCallback((widgetId: string) => {
    setWidgetStates(prev => ({
      ...prev,
      [widgetId]: { ...prev[widgetId], isMinimized: true }
    }));
  }, []);

  const maximizeWidget = useCallback((widgetId: string) => {
    setWidgetStates(prev => ({
      ...prev,
      [widgetId]: { ...prev[widgetId], isMinimized: false }
    }));
  }, []);

  const resetWidgetPositions = useCallback(() => {
    setWidgetStates(
      Object.entries(defaultPositions).reduce((acc, [id, position]) => ({
        ...acc,
        [id]: { id, isVisible: true, position, isMinimized: false }
      }), {})
    );
  }, []);

  const closeAllWidgets = useCallback(() => {
    setWidgetStates(prev =>
      Object.entries(prev).reduce((acc, [id, state]) => ({
        ...acc,
        [id]: { ...state, isVisible: false }
      }), {} as Record<string, WidgetState>)
    );
  }, []);

  const openAllWidgets = useCallback(() => {
    setWidgetStates(prev =>
      Object.entries(prev).reduce((acc, [id, state]) => ({
        ...acc,
        [id]: { ...state, isVisible: true }
      }), {} as Record<string, WidgetState>)
    );
  }, []);

  return {
    widgetStates,
    updateWidgetPosition,
    toggleWidgetVisibility,
    closeWidget,
    openWidget,
    minimizeWidget,
    maximizeWidget,
    resetWidgetPositions,
    closeAllWidgets,
    openAllWidgets
  };
};