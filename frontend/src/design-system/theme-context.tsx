import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

import {
  ColorPalette,
  getCurrentTimePeriod,
  getTimeBasedPalette,
  generateCSSVariables,
} from './colors';
import { generateTypographyVariables } from './typography';
import { soundManager, initializeSounds } from './sound';

interface ThemeContextType {
  timePeriod: string;
  palette: ColorPalette;
  isTimeBasedEnabled: boolean;
  soundEnabled: boolean;
  toggleTimeBasedTheme: () => void;
  toggleSound: () => void;
  setCustomPalette: (palette: ColorPalette) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useDesignSystem = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useDesignSystem must be used within a DesignSystemProvider');
  }
  return context;
};

interface DesignSystemProviderProps {
  children: React.ReactNode;
}

export const DesignSystemProvider: React.FC<DesignSystemProviderProps> = ({ children }) => {
  const [timePeriod, setTimePeriod] = useState(getCurrentTimePeriod());
  const [isTimeBasedEnabled, setIsTimeBasedEnabled] = useState(() => {
    const saved = localStorage.getItem('examinr-time-based-theme');
    return saved !== 'false';
  });
  const [customPalette, setCustomPalette] = useState<ColorPalette | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(() => soundManager.isEnabled());

  // Initialize sounds on mount
  useEffect(() => {
    initializeSounds();
  }, []);

  // Update time period every minute
  useEffect(() => {
    if (!isTimeBasedEnabled) return;

    const updateTimePeriod = () => {
      const newPeriod = getCurrentTimePeriod();
      if (newPeriod !== timePeriod) {
        setTimePeriod(newPeriod);
      }
    };

    const interval = setInterval(updateTimePeriod, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [timePeriod, isTimeBasedEnabled]);

  // Apply CSS variables when palette changes
  const palette = useMemo(() => {
    if (customPalette) return customPalette;
    if (isTimeBasedEnabled) return getTimeBasedPalette();
    return getTimeBasedPalette(); // Default to time-based even if disabled
  }, [timePeriod, isTimeBasedEnabled, customPalette]);

  useEffect(() => {
    const updateTheme = () => {
      const root = document.documentElement;
      const isDarkMode = root.classList.contains('dark');

      // Only apply design system colors in light mode or for specific elements
      if (!isDarkMode) {
        const colorVars = generateCSSVariables(palette);
        const typographyVars = generateTypographyVariables();

        // Apply CSS variables
        const cssText = `${colorVars}\n${typographyVars}`;
        cssText.split('\n').forEach((line) => {
          const match = line.trim().match(/^(--[\w-]+):\s*(.+);?$/);
          if (match) {
            root.style.setProperty(match[1], match[2]);
          }
        });
      } else {
        // In dark mode, only set typography variables
        const typographyVars = generateTypographyVariables();
        const cssText = typographyVars;
        cssText.split('\n').forEach((line) => {
          const match = line.trim().match(/^(--[\w-]+):\s*(.+);?$/);
          if (match && match[1].includes('font')) {
            root.style.setProperty(match[1], match[2]);
          }
        });
      }
    };

    updateTheme();

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [palette]);

  const toggleTimeBasedTheme = () => {
    const newState = !isTimeBasedEnabled;
    setIsTimeBasedEnabled(newState);
    localStorage.setItem('examinr-time-based-theme', newState.toString());
  };

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundManager.setEnabled(newState);
  };

  const value = {
    timePeriod,
    palette,
    isTimeBasedEnabled,
    soundEnabled,
    toggleTimeBasedTheme,
    toggleSound,
    setCustomPalette,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
