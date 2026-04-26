import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';

/**
 * PropCalc Brand Colors
 * See docs/BRAND_GUIDE.md for full design system documentation.
 */

export const brandColors = {
  teal: {
    50: '#E0F2F1',
    100: '#B2DFDB',
    200: '#80CBC4',
    300: '#4DB6AC',
    400: '#26A69A',
    500: '#0D7377',
    600: '#00897B',
    700: '#00796B',
    800: '#00695C',
    900: '#004D40',
  },
  gold: {
    50: '#FFF8E1',
    100: '#FFECB3',
    200: '#FFE082',
    300: '#FFD54F',
    400: '#FFCA28',
    500: '#D4A017',
    600: '#FFB300',
    700: '#FFA000',
    800: '#FF8F00',
    900: '#FF6F00',
  },
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    950: '#0F1419',
  },
  semantic: {
    success: '#2E7D32',
    successLight: '#4CAF50',
    warning: '#F57C00',
    warningLight: '#FF9800',
    error: '#C62828',
    errorLight: '#EF5350',
    info: '#1565C0',
    infoLight: '#42A5F5',
  },
};

/**
 * Custom React Native Paper theme for PropCalc
 */
export const propCalcLightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: brandColors.teal[500],
    onPrimary: '#FFFFFF',
    primaryContainer: brandColors.teal[50],
    onPrimaryContainer: brandColors.teal[900],
    secondary: brandColors.gold[500],
    onSecondary: '#1A1A1A',
    secondaryContainer: brandColors.gold[50],
    onSecondaryContainer: brandColors.gold[900],
    tertiary: brandColors.gold[400],
    onTertiary: '#1A1A1A',
    tertiaryContainer: brandColors.gold[50],
    onTertiaryContainer: brandColors.gold[900],
    error: brandColors.semantic.error,
    onError: '#FFFFFF',
    errorContainer: '#FFEBEE',
    onErrorContainer: '#B71C1C',
    background: brandColors.neutral[50],
    onBackground: '#1A1A2E',
    surface: brandColors.neutral[0],
    onSurface: '#2D2D3A',
    surfaceVariant: brandColors.neutral[100],
    onSurfaceVariant: '#6B7280',
    outline: brandColors.neutral[300],
    outlineVariant: brandColors.neutral[200],
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#2D2D3A',
    inverseOnSurface: '#F5F5F5',
    inversePrimary: brandColors.teal[300],
    elevation: {
      level0: 'transparent',
      level1: '#FFFFFF',
      level2: '#FFFFFF',
      level3: '#FFFFFF',
      level4: '#FFFFFF',
      level5: '#FFFFFF',
    },
    surfaceDisabled: 'rgba(26, 26, 46, 0.12)',
    onSurfaceDisabled: 'rgba(26, 26, 46, 0.38)',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  roundness: 3, // Multiplier for border radius (12px base * 3 = 36px max, use manual values for components)
};

export const propCalcDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#14A3A8',
    onPrimary: '#FFFFFF',
    primaryContainer: '#1E3A3C',
    onPrimaryContainer: '#E0F2F1',
    secondary: '#E8C547',
    onSecondary: '#1A1A1A',
    secondaryContainer: '#3D3220',
    onSecondaryContainer: '#FFF8E1',
    tertiary: '#FFD54F',
    onTertiary: '#1A1A1A',
    tertiaryContainer: '#3D3220',
    onTertiaryContainer: '#FFF8E1',
    error: brandColors.semantic.errorLight,
    onError: '#FFFFFF',
    errorContainer: '#3E1C1C',
    onErrorContainer: '#FFEBEE',
    background: brandColors.neutral[950],
    onBackground: '#E8E8E8',
    surface: '#1A1F2E',
    onSurface: '#D0D0D0',
    surfaceVariant: '#252B3B',
    onSurfaceVariant: '#9CA3AF',
    outline: '#3A4458',
    outlineVariant: '#2A3448',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#E8E8E8',
    inverseOnSurface: '#1A1A2E',
    inversePrimary: brandColors.teal[500],
    elevation: {
      level0: 'transparent',
      level1: '#1A1F2E',
      level2: '#1A1F2E',
      level3: '#1A1F2E',
      level4: '#1A1F2E',
      level5: '#1A1F2E',
    },
    surfaceDisabled: 'rgba(232, 232, 232, 0.12)',
    onSurfaceDisabled: 'rgba(232, 232, 232, 0.38)',
    backdrop: 'rgba(0, 0, 0, 0.7)',
  },
  roundness: 3,
};

/**
 * Spacing tokens
 */
export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
} as const;

/**
 * Border radius tokens
 */
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

/**
 * Shadow styles for light mode
 */
export const shadows = {
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
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;
