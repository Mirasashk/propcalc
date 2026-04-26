import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface QuickActionProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  path: string;
  color: string;
}

function QuickAction({ title, icon, path, color }: QuickActionProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={() => router.push(path as any)}
      style={[styles.actionCard, { backgroundColor: theme.colors.surface }]}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text variant="titleMedium" style={[styles.actionTitle, { color: theme.colors.onSurface }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen(): React.JSX.Element {
  const theme = useTheme();

  const actions: QuickActionProps[] = [
    { title: 'Mortgage', icon: 'home', path: '/calculators/mortgage', color: '#0D7377' },
    { title: 'ROI', icon: 'cash', path: '/calculators/roi', color: '#D4A017' },
    { title: 'Cap Rate', icon: 'trending-up', path: '/calculators/cap-rate', color: '#2E7D32' },
    { title: 'Saved', icon: 'bookmark', path: '/saved', color: '#1565C0' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.headerSection}>
        <View style={[styles.logoContainer, { backgroundColor: theme.colors.primaryContainer }]}>
          <Ionicons name="calculator" size={40} color={theme.colors.primary} />
        </View>
        <Text variant="displayMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
          PropCalc
        </Text>
        <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          Real Estate Investment Calculator
        </Text>
      </View>

      {/* Quick Actions Grid */}
      <View style={styles.actionsGrid}>
        {actions.map((action) => (
          <QuickAction key={action.title} {...action} />
        ))}
      </View>

      {/* Pro Badge */}
      <View style={[styles.proBanner, { backgroundColor: theme.colors.secondaryContainer }]}>
        <Ionicons name="sparkles" size={20} color={theme.colors.secondary} />
        <Text variant="bodyMedium" style={[styles.proText, { color: theme.colors.onSecondaryContainer }]}>
          Upgrade to Pro for unlimited saves and cloud sync
        </Text>
      </View>

      {/* Footer */}
      <Text variant="bodySmall" style={[styles.footer, { color: theme.colors.onSurfaceVariant }]}>
        All calculations are estimates. Consult a financial advisor.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontWeight: '600',
  },
  proBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  proText: {
    flex: 1,
    fontWeight: '500',
  },
  footer: {
    textAlign: 'center',
    marginTop: 8,
  },
});
