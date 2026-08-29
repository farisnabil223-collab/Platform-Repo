export const brandConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'EduVerse',
  shortName: 'EduVerse',
  tagline: 'Enterprise Educational Platform for Next-Gen Learning',
  description: 'A modern, multi-tenant LMS and educational management platform built for students, teachers, parents, and administrators.',
  supportEmail: 'support@eduverse.com',
  contactEmail: 'contact@eduverse.com',
  legalEmail: 'legal@eduverse.com',
  domain: process.env.NEXT_PUBLIC_APP_DOMAIN || 'eduverse.com',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://eduverse.com',
  copyright: '© 2026 EduVerse Platform. All rights reserved.',
  themeColor: '#1B2C50',
  tileColor: '#12203B',
};

export const colors = {
  brand: {
    navyInk: 'hsl(219, 49%, 21%)',
    deepNavy: 'hsl(219, 41%, 15%)',
    amber: 'hsl(36, 79%, 57%)',
    teal: 'hsl(173, 58%, 39%)',
    coral: 'hsl(8, 74%, 56%)',
    paper: 'hsl(43, 33%, 96%)',
    textInk: 'hsl(20, 11%, 12%)',
  },
  light: {
    background: 'hsl(43, 33%, 96%)',
    foreground: 'hsl(20, 11%, 12%)',
    primary: 'hsl(219, 49%, 21%)',
    primaryForeground: 'hsl(43, 33%, 96%)',
    secondary: 'hsl(43, 20%, 90%)',
    secondaryForeground: 'hsl(219, 49%, 21%)',
    muted: 'hsl(43, 20%, 92%)',
    mutedForeground: 'hsl(20, 8%, 45%)',
    accent: 'hsl(173, 58%, 39%)',
    accentForeground: 'hsl(0, 0%, 100%)',
    destructive: 'hsl(8, 74%, 56%)',
    destructiveForeground: 'hsl(0, 0%, 100%)',
    border: 'hsl(43, 15%, 85%)',
    input: 'hsl(43, 15%, 85%)',
    ring: 'hsl(219, 49%, 21%)',
    popover: 'hsl(0, 0%, 100%)',
    popoverForeground: 'hsl(20, 11%, 12%)',
    card: 'hsl(0, 0%, 100%)',
    cardForeground: 'hsl(20, 11%, 12%)',
  },
  dark: {
    background: 'hsl(219, 41%, 15%)',
    foreground: 'hsl(43, 33%, 96%)',
    primary: 'hsl(219, 49%, 30%)',
    primaryForeground: 'hsl(43, 33%, 96%)',
    secondary: 'hsl(219, 35%, 22%)',
    secondaryForeground: 'hsl(43, 33%, 96%)',
    muted: 'hsl(219, 35%, 22%)',
    mutedForeground: 'hsl(219, 20%, 65%)',
    accent: 'hsl(173, 58%, 39%)',
    accentForeground: 'hsl(43, 33%, 96%)',
    destructive: 'hsl(8, 74%, 56%)',
    destructiveForeground: 'hsl(0, 0%, 100%)',
    border: 'hsl(219, 30%, 25%)',
    input: 'hsl(219, 30%, 25%)',
    ring: 'hsl(36, 79%, 57%)',
    popover: 'hsl(219, 45%, 18%)',
    popoverForeground: 'hsl(43, 33%, 96%)',
    card: 'hsl(219, 45%, 18%)',
    cardForeground: 'hsl(43, 33%, 96%)',
  },
};

export const typography = {
  fontSans: '"Cairo", sans-serif',
  fontHeading: '"Changa", sans-serif',
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  fontWeight: {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
};

export const spacing = {
  '0': '0rem',
  '1': '0.25rem',
  '2': '0.5rem',
  '3': '0.75rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '8': '2rem',
  '10': '2.5rem',
  '12': '3rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem',
  '32': '8rem',
  '40': '10rem',
  '48': '12rem',
  '56': '14rem',
  '64': '16rem',
};

export const zIndex = {
  sticky: '10',
  navigation: '20',
  dropdown: '30',
  popover: '40',
  modal: '50',
  drawer: '50',
  tooltip: '60',
  toast: '70',
};

export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
};

export const borderRadius = {
  none: '0px',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  full: '9999px',
};

export const motion = {
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
  },
  transition: {
    default: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  ease: {
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    decelerate: 'cubic-bezier(0.0, 0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
  },
};

export const opacity = {
  hover: '0.85',
  active: '0.95',
  disabled: '0.5',
  overlay: '0.4',
};

export const iconSizes = {
  xs: '14px',
  sm: '16px',
  md: '20px',
  lg: '24px',
  xl: '32px',
};

export const layoutSizes = {
  sidebarWidth: '260px',
  sidebarCollapsedWidth: '72px',
  topbarHeight: '64px',
  footerHeight: '56px',
  maxContentWidth: '1440px',
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};
