export const theme = {
  colors: {
    primary500: '#007AFF',
    primary400: '#339FFF',
    primary300: '#66B8FF',
    primary200: '#99D1FF',
    primary100: '#CCE8FF',
    
    accent600: '#5856D6',
    accent500: '#7B7AE8',
    accent400: '#9E9DF4',
    accent300: '#C1C0FF',
    accent200: '#E4E3FF',
    
    success600: '#34C759',
    success500: '#5DD87A',
    success400: '#86E99B',
    success300: '#AFFABC',
    success200: '#D8FFDD',
    
    error600: '#FF3B30',
    error500: '#FF6259',
    error400: '#FF8982',
    error300: '#FFB0AB',
    error200: '#FFD7D4',
    
    warning600: '#FF9500',
    warning500: '#FFAA33',
    warning400: '#FFBF66',
    warning300: '#FFD499',
    warning200: '#FFE9CC',
    
    verified: '#1DA1F2',
    
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
    
    white: '#FFFFFF',
    black: '#000000',
    text: '#1C1C1E',
    
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
    },
    
    red: {
      100: '#FEE2E2',
      600: '#DC2626',
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 32,
    xl: 48,
    xxl: 64,
  },
  
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
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
  },
} as const;

export type Theme = typeof theme;