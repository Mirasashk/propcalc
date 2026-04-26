import React from 'react';
import { StyleProp, ViewStyle, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  icon?: React.ReactNode;
}

export const Button = React.memo(function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  accessibilityLabel,
  icon,
}: ButtonProps): React.JSX.Element {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  // Background color
  const backgroundColor = (() => {
    if (isDisabled) return theme.colors.surfaceDisabled;
    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.secondary;
      case 'danger':
        return theme.colors.error;
      case 'outline':
      case 'ghost':
        return 'transparent';
      default:
        return theme.colors.primary;
    }
  })();

  // Text color
  const textColor = (() => {
    if (isDisabled) return theme.colors.onSurfaceDisabled;
    switch (variant) {
      case 'primary':
        return theme.colors.onPrimary;
      case 'secondary':
        return theme.colors.onSecondary;
      case 'danger':
        return theme.colors.onError;
      case 'outline':
        return theme.colors.primary;
      case 'ghost':
        return theme.colors.onSurface;
      default:
        return theme.colors.onPrimary;
    }
  })();

  // Border
  const borderColor = (() => {
    if (isDisabled) return theme.colors.outline;
    if (variant === 'outline') return theme.colors.primary;
    return 'transparent';
  })();

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor,
          borderColor,
          opacity: pressed ? 0.9 : 1,
          transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
        },
        style,
      ]}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text variant="titleMedium" style={[styles.text, { color: textColor }]}>
        {title}
      </Text>
    </Pressable>
  );
});

import { View } from 'react-native';

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconContainer: {
    marginRight: 4,
  },
  text: {
    fontWeight: '600',
  },
});
