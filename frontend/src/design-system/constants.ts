// Design System Constants
export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
  ultraWide: 1536,
} as const;

export const TRANSITIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
  xslow: 1000,
} as const;

export const Z_INDEX = {
  background: -1,
  blob: 0,
  content: 10,
  overlay: 20,
  modal: 30,
  popover: 40,
  tooltip: 50,
  notification: 60,
} as const;

export const ANIMATION_DURATION = {
  microInteraction: '50ms',
  hover: '200ms',
  pageTransition: '300ms',
  blob: '20s',
  particle: '3s',
  confetti: '5s',
} as const;
export const SOUND_ENABLED_KEY = 'examinr-sound-enabled';
export const THEME_MODE_KEY = 'examinr-theme-mode';
export const TIME_BASED_THEME_KEY = 'examinr-time-based-theme';
