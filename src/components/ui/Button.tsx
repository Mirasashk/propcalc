import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Button as PaperButton, useTheme } from 'react-native-paper';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  icon?: string;
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

  const buttonMode = variant === 'outline' ? 'outlined' : 'contained';

  const buttonColor =
    variant === 'danger'
      ? theme.colors.error
      : variant === 'secondary'
      ? theme.colors.secondary
      : theme.colors.primary;

  const textColor =
    variant === 'outline'
      ? theme.colors.primary
      : variant === 'secondary'
      ? theme.colors.onSecondary
      : variant === 'danger'
      ? theme.colors.onError
      : theme.colors.onPrimary;

  return (
    <PaperButton
      mode={buttonMode}
      onPress={onPress}
      loading={loading}
      disabled={disabled || loading}
      style={[{ minHeight: 48, justifyContent: 'center' }, style]}
      buttonColor={buttonColor}
      textColor={textColor}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      icon={icon}
      contentStyle={{ minHeight: 48 }}
    >
      {title}
    </PaperButton>
  );
});
