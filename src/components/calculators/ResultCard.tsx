import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { formatCurrency } from '@engine/utils/currency';

interface ResultCardProps {
  title: string;
  value: number;
  unit?: string;
  highlight?: boolean;
  accessibilityLabel?: string;
}

export const ResultCard = React.memo(function ResultCard({
  title,
  value,
  unit,
  highlight = false,
  accessibilityLabel,
}: ResultCardProps): React.JSX.Element {
  const theme = useTheme();

  const displayValue = unit
    ? `${value.toLocaleString('en-US')}${unit}`
    : formatCurrency(value);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: highlight
            ? theme.colors.primaryContainer
            : theme.colors.surfaceVariant,
          borderColor: highlight ? theme.colors.primary : 'transparent',
          borderWidth: highlight ? 2 : 0,
        },
      ]}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel ?? `${title}: ${displayValue}`}
    >
      <Text
        variant="bodySmall"
        style={[styles.title, { color: theme.colors.onSurfaceVariant }]}
      >
        {title}
      </Text>
      <Text
        variant="headlineSmall"
        style={[
          styles.value,
          {
            color: highlight
              ? theme.colors.primary
              : theme.colors.onSurface,
          },
        ]}
      >
        {displayValue}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    minHeight: 80,
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    marginBottom: 4,
  },
  value: {
    fontWeight: '700',
  },
});
