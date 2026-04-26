import React from 'react';
import { StyleSheet, StyleProp, ViewStyle, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

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
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outline,
          shadowColor: theme.colors.shadow,
        },
        style,
      ]}
    >
      {title && (
        <View style={styles.titleContainer}>
          <Text
            variant="headlineMedium"
            style={[styles.title, { color: theme.colors.onSurface }]}
          >
            {title}
          </Text>
        </View>
      )}
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
