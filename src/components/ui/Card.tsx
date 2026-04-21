import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Card as PaperCard, useTheme } from 'react-native-paper';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export const Card = React.memo(function Card({
  title,
  children,
  style,
  contentStyle,
}: CardProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <PaperCard
      style={[
        styles.card,
        { backgroundColor: theme.colors.surfaceVariant },
        style,
      ]}
      accessibilityLabel={title}
    >
      {title && (
        <PaperCard.Title
          title={title}
          titleStyle={[styles.title, { color: theme.colors.onSurface }]}
        />
      )}
      <PaperCard.Content style={contentStyle}>
        {children}
      </PaperCard.Content>
    </PaperCard>
  );
});

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
});
