import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, useTheme, HelperText } from 'react-native-paper';
import { parseCurrency, formatCurrency } from '@engine/utils/currency';

type KeyboardType = 'default' | 'numeric' | 'decimal-pad' | 'number-pad';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardType;
  placeholder?: string;
  error?: string;
  helperText?: string;
  accessibilityLabel?: string;
  secureTextEntry?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  /** When true, formats as currency on blur */
  currency?: boolean;
  /** Suffix to display (e.g. '%', 'years') */
  suffix?: string;
}

export const Input = React.memo(function Input({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
  placeholder,
  error,
  helperText,
  accessibilityLabel,
  secureTextEntry,
  autoFocus,
  disabled,
  currency,
  suffix,
}: InputProps): React.JSX.Element {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (currency && value) {
      try {
        const parsed = parseCurrency(value);
        onChangeText(formatCurrency(parsed));
      } catch {
        // Keep raw value if parsing fails
      }
    }
  }, [currency, value, onChangeText]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (currency && value) {
      // Strip formatting on focus for easier editing
      try {
        const parsed = parseCurrency(value);
        onChangeText(parsed.toString());
      } catch {
        // Keep as-is
      }
    }
  }, [currency, value, onChangeText]);

  const displayValue = isFocused && currency && value
    ? (() => { try { return parseCurrency(value).toString(); } catch { return value; } })()
    : value;

  return (
    <View style={styles.container}>
      <TextInput
        label={label}
        value={displayValue}
        onChangeText={onChangeText}
        onBlur={handleBlur}
        onFocus={handleFocus}
        keyboardType={keyboardType}
        placeholder={placeholder}
        error={!!error}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={helperText}
        secureTextEntry={secureTextEntry}
        autoFocus={autoFocus}
        disabled={disabled}
        mode="outlined"
        style={[
          styles.input,
          { backgroundColor: theme.colors.surface },
        ]}
        outlineColor={theme.colors.outline}
        activeOutlineColor={theme.colors.primary}
        right={suffix ? <TextInput.Affix text={` ${suffix}`} /> : undefined}
      />
      {(error || helperText) && (
        <HelperText type={error ? 'error' : 'info'} visible={!!error || !!helperText}>
          {error || helperText}
        </HelperText>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    minHeight: 44,
  },
  input: {
    minHeight: 56,
  },
});
