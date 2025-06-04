// Dynamic Color System import { format } from 'date-fns';

export interface ColorPalette {
  primary: {
    gradient: string;
    solid: string;
    light: string;
    dark: string;
  };

  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    overlay: string;
  };

  accent: {
    primary: string;
    secondary: string;
    glow: string;
  };

  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };

  emotional: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export const TIME_PERIODS = {
  MORNING: { start: 5, end: 12, name: 'morning' },
  AFTERNOON: { start: 12, end: 18, name: 'afternoon' },
  EVENING: { start: 18, end: 24, name: 'evening' },
  NIGHT: { start: 0, end: 5, name: 'night' },
} as const;

export const COLOR_PALETTES: Record<string, ColorPalette> = {
  morning: {
    primary: {
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #F59E0B 100%)',
      solid: '#8B5CF6',
      light: '#A78BFA',
      dark: '#7C3AED',
    },
    background: {
      primary: '#FFFBF5',
      secondary: '#FFF8F0',
      tertiary: '#FFFFFF',
      overlay: 'rgba(139, 92, 246, 0.1)',
    },
    accent: {
      primary: '#FCD34D',
      secondary: '#FDE68A',
      glow: 'rgba(252, 211, 77, 0.5)',
    },
    text: {
      primary: '#1F2937',
      secondary: '#4B5563',
      tertiary: '#6B7280',
      inverse: '#FFFFFF',
    },
    emotional: {
      success: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
      warning: 'linear-gradient(135deg, #F59E0B 0%, #FB923C 100%)',
      error: 'linear-gradient(135deg, #FB7185 0%, #EC4899 100%)',
      info: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
    },
  },
  afternoon: {
    primary: {
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
      solid: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F3F4F6',
      tertiary: '#E5E7EB',
      overlay: 'rgba(59, 130, 246, 0.1)',
    },
    accent: {
      primary: '#10B981',
      secondary: '#34D399',
      glow: 'rgba(16, 185, 129, 0.5)',
    },
    text: {
      primary: '#111827',
      secondary: '#374151',
      tertiary: '#6B7280',
      inverse: '#FFFFFF',
    },
    emotional: {
      success: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
      warning: 'linear-gradient(135deg, #F59E0B 0%, #FB923C 100%)',
      error: 'linear-gradient(135deg, #FB7185 0%, #EC4899 100%)',
      info: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
    },
  },
  evening: {
    primary: {
      gradient: 'linear-gradient(135deg, #7C3AED 0%, #1E3A8A 100%)',
      solid: '#7C3AED',
      light: '#8B5CF6',
      dark: '#6D28D9',
    },
    background: {
      primary: '#F9FAFB',
      secondary: '#F3F4F6',
      tertiary: '#E5E7EB',
      overlay: 'rgba(124, 58, 237, 0.1)',
    },
    accent: {
      primary: '#F59E0B',
      secondary: '#FBBF24',
      glow: 'rgba(245, 158, 11, 0.5)',
    },
    text: {
      primary: '#1F2937',
      secondary: '#4B5563',
      tertiary: '#6B7280',
      inverse: '#FFFFFF',
    },
    emotional: {
      success: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
      warning: 'linear-gradient(135deg, #F59E0B 0%, #FB923C 100%)',
      error: 'linear-gradient(135deg, #FB7185 0%, #EC4899 100%)',
      info: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
    },
  },
  night: {
    primary: {
      gradient: 'linear-gradient(135deg, #1E293B 0%, #7C3AED 100%)',
      solid: '#7C3AED',
      light: '#8B5CF6',
      dark: '#1E293B',
    },
    background: {
      primary: '#0F172A',
      secondary: '#1E293B',
      tertiary: '#334155',
      overlay: 'rgba(124, 58, 237, 0.2)',
    },
    accent: {
      primary: '#F59E0B',
      secondary: '#FBBF24',
      glow: 'rgba(245, 158, 11, 0.3)',
    },
    text: {
      primary: '#F9FAFB',
      secondary: '#E5E7EB',
      tertiary: '#9CA3AF',
      inverse: '#111827',
    },
    emotional: {
      success: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
      warning: 'linear-gradient(135deg, #F59E0B 0%, #FB923C 100%)',
      error: 'linear-gradient(135deg, #FB7185 0%, #EC4899 100%)',
      info: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
    },
  },
};

export function getCurrentTimePeriod(): string {
  const hour = new Date().getHours();
  if (hour >= TIME_PERIODS.MORNING.start && hour < TIME_PERIODS.MORNING.end) {
    return TIME_PERIODS.MORNING.name;
  } else if (hour >= TIME_PERIODS.AFTERNOON.start && hour < TIME_PERIODS.AFTERNOON.end) {
    return TIME_PERIODS.AFTERNOON.name;
  } else if (hour >= TIME_PERIODS.EVENING.start && hour < TIME_PERIODS.EVENING.end) {
    return TIME_PERIODS.EVENING.name;
  } else {
    return TIME_PERIODS.NIGHT.name;
  }
}

export function getTimeBasedPalette(): ColorPalette {
  const period = getCurrentTimePeriod();
  return COLOR_PALETTES[period];
}

export function generateCSSVariables(palette: ColorPalette): string {
  return `
    --color-primary-gradient: ${palette.primary.gradient};
    --color-primary-solid: ${palette.primary.solid};
    --color-primary-light: ${palette.primary.light};
    --color-primary-dark: ${palette.primary.dark};
    --color-bg-primary: ${palette.background.primary};
    --color-bg-secondary: ${palette.background.secondary};
    --color-bg-tertiary: ${palette.background.tertiary};
    --color-bg-overlay: ${palette.background.overlay};
    --color-accent-primary: ${palette.accent.primary};
    --color-accent-secondary: ${palette.accent.secondary};
    --color-accent-glow: ${palette.accent.glow};
    --color-text-primary: ${palette.text.primary};
    --color-text-secondary: ${palette.text.secondary};
    --color-text-tertiary: ${palette.text.tertiary};
    --color-text-inverse: ${palette.text.inverse};
    --color-success: ${palette.emotional.success};
    --color-warning: ${palette.emotional.warning};
    --color-error: ${palette.emotional.error};
    --color-info: ${palette.emotional.info};
  `;
}
