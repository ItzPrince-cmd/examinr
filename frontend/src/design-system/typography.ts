// Typography System
export const FONT_FAMILIES = {
  heading: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  special: "'Caveat', cursive",
  mono: "'JetBrains Mono', 'Consolas', 'Monaco', monospace",
} as const;

export const FONT_SIZES = {
  xs: '0.75rem', // 12px
  sm: '0.875rem', // 14px
  base: '1rem', // 16px
  lg: '1.125rem', // 18px
  xl: '1.25rem', // 20px
  '2xl': '1.5rem', // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem', // 48px
  '6xl': '3.75rem', // 60px
  '7xl': '4.5rem', // 72px
} as const;

export const FONT_WEIGHTS = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

export const LINE_HEIGHTS = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

export const LETTER_SPACING = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

export interface TypographyVariant {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: string;
}

export const TYPOGRAPHY_VARIANTS: Record<string, TypographyVariant> = {
  h1: {
    fontFamily: FONT_FAMILIES.heading,
    fontSize: FONT_SIZES['5xl'],
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: LINE_HEIGHTS.tight,
    letterSpacing: LETTER_SPACING.tight,
  },
  h2: {
    fontFamily: FONT_FAMILIES.heading,
    fontSize: FONT_SIZES['4xl'],
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: LINE_HEIGHTS.tight,
    letterSpacing: LETTER_SPACING.tight,
  },
  h3: {
    fontFamily: FONT_FAMILIES.heading,
    fontSize: FONT_SIZES['3xl'],
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: LINE_HEIGHTS.snug,
    letterSpacing: LETTER_SPACING.normal,
  },
  h4: {
    fontFamily: FONT_FAMILIES.heading,
    fontSize: FONT_SIZES['2xl'],
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.snug,
    letterSpacing: LETTER_SPACING.normal,
  },
  h5: {
    fontFamily: FONT_FAMILIES.heading,
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.normal,
  },
  h6: {
    fontFamily: FONT_FAMILIES.heading,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.normal,
  },
  body1: {
    fontFamily: FONT_FAMILIES.body,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.normal,
    lineHeight: LINE_HEIGHTS.relaxed,
    letterSpacing: LETTER_SPACING.normal,
  },
  body2: {
    fontFamily: FONT_FAMILIES.body,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.normal,
    lineHeight: LINE_HEIGHTS.relaxed,
    letterSpacing: LETTER_SPACING.normal,
  },
  caption: {
    fontFamily: FONT_FAMILIES.body,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.normal,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.wide,
  },
  button: {
    fontFamily: FONT_FAMILIES.body,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.wider,
  },
  special: {
    fontFamily: FONT_FAMILIES.special,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.normal,
    lineHeight: LINE_HEIGHTS.relaxed,
    letterSpacing: LETTER_SPACING.normal,
  },
  code: {
    fontFamily: FONT_FAMILIES.mono,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.normal,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.normal,
  },
};

// CSS Custom Properties Generator
export function generateTypographyVariables(): string {
  return `
    --font-heading: ${FONT_FAMILIES.heading};
    --font-body: ${FONT_FAMILIES.body};
    --font-special: ${FONT_FAMILIES.special};
    --font-mono: ${FONT_FAMILIES.mono};
    --text-xs: ${FONT_SIZES.xs};
    --text-sm: ${FONT_SIZES.sm};
    --text-base: ${FONT_SIZES.base};
    --text-lg: ${FONT_SIZES.lg};
    --text-xl: ${FONT_SIZES.xl};
    --text-2xl: ${FONT_SIZES['2xl']};
    --text-3xl: ${FONT_SIZES['3xl']};
    --text-4xl: ${FONT_SIZES['4xl']};
    --text-5xl: ${FONT_SIZES['5xl']};
    --text-6xl: ${FONT_SIZES['6xl']};
    --text-7xl: ${FONT_SIZES['7xl']};
  `;
}