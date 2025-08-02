export const theme = {
  colors: {
    // Primary colors
    primary500: '#007AFF',
    primary400: '#339FFF',
    primary300: '#66B8FF',
    primary200: '#99D1FF',
    primary100: '#CCE8FF',
    primary50: '#E6F3FF',
    
    // Accent colors
    accent600: '#5856D6',
    accent500: '#7B7AE8',
    accent400: '#9E9DF4',
    accent300: '#C1C0FF',
    accent200: '#E4E3FF',
    accent100: '#F0EFFF',
    
    // Success colors
    success600: '#34C759',
    success500: '#5DD87A',
    success400: '#86E99B',
    success300: '#AFFABC',
    success200: '#D8FFDD',
    success100: '#ECFFEE',
    
    // Error colors
    error600: '#FF3B30',
    error500: '#FF6259',
    error400: '#FF8982',
    error300: '#FFB0AB',
    error200: '#FFD7D4',
    error100: '#FFEBEA',
    
    // Warning colors
    warning600: '#FF9500',
    warning500: '#FFAA33',
    warning400: '#FFBF66',
    warning300: '#FFD499',
    warning200: '#FFE9CC',
    warning100: '#FFF4E6',
    
    // Special colors
    verified: '#1DA1F2',
    premium: '#FFD700',
    
    // Neutral colors
    neutral900: '#000000',
    neutral800: '#1C1C1E',
    neutral700: '#6D6D70',
    neutral600: '#8E8E93',
    neutral500: '#AEAEB2',
    neutral400: '#C7C7CC',
    neutral300: '#D1D1D6',
    neutral200: '#E5E5EA',
    neutral100: '#F2F2F7',
    neutral50: '#FAFAFA',
    neutral25: '#FCFCFD',
    
    // Base colors
    white: '#FFFFFF',
    black: '#000000',
    text: '#1C1C1E',
    textSecondary: '#6D6D70',
    textTertiary: '#8E8E93',
    
    // Background colors
    background: '#FFFFFF',
    backgroundSecondary: '#F2F2F7',
    backgroundTertiary: '#FAFAFA',
    
    // Border colors
    border: '#E5E5EA',
    borderSecondary: '#D1D1D6',
    
    // Legacy gray scale (for backward compatibility)
    gray: {
      25: '#FCFCFD',
      50: '#FAFAFA',
      100: '#F2F2F7',
      200: '#E5E5EA',
      300: '#D1D1D6',
      400: '#C7C7CC',
      500: '#AEAEB2',
      600: '#8E8E93',
      700: '#6D6D70',
      800: '#1C1C1E',
      900: '#000000',
    },
    
    // Legacy red scale (for backward compatibility)
    red: {
      100: '#FEE2E2',
      600: '#DC2626',
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
    xxxxl: 80,
  },
  
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    xxxxl: 32,
    xxxxxl: 36,
  },
  
  fontWeight: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  
  borderRadius: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    full: 9999,
  },
  
  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    xs: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03,
      shadowRadius: 1,
      elevation: 1,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 12,
    },
  },
  
  // Animation durations
  animation: {
    fast: 150,
    normal: 250,
    slow: 350,
    slower: 500,
  },
  
  // Z-index values
  zIndex: {
    hide: -1,
    auto: 'auto' as const,
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
} as const;

export type Theme = typeof theme;