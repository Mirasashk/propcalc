import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CalculatorsScreen(): React.JSX.Element {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const calculators = [
    { title: 'Mortgage', path: '/calculators/mortgage' as const, icon: 'home' as const, available: true, color: '#0D7377', description: 'Monthly payments & amortization' },
    { title: 'ROI', path: '/calculators/roi' as const, icon: 'cash' as const, available: true, color: '#D4A017', description: 'Cash-on-cash return analysis' },
    { title: 'Cap Rate', path: '/calculators/cap-rate' as const, icon: 'trending-up' as const, available: true, color: '#2E7D32', description: 'Property profitability metric' },
    { title: 'Rent vs Buy', path: '/calculators/rent-vs-buy' as const, icon: 'swap-horizontal' as const, available: false, color: '#6B7280', description: 'Compare options' },
    { title: 'Fix & Flip', path: '/calculators/fix-flip' as const, icon: 'hammer' as const, available: false, color: '#6B7280', description: 'Renovation profit analysis' },
    { title: 'Compare', path: '/calculators/compare' as const, icon: 'git-compare' as const, available: false, color: '#6B7280', description: 'Side-by-side properties' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[
        styles.content,
        isTablet && styles.contentTablet,
      ]}
    >
      <Text
        variant="headlineMedium"
        style={[styles.header, { color: theme.colors.onBackground }]}
      >
        Calculators
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.subheader, { color: theme.colors.onSurfaceVariant }]}
      >
        Choose a calculator to get started
      </Text>

      <View style={styles.grid}>
        {calculators.map((calc) => (
          <TouchableOpacity
            key={calc.title}
            onPress={() => calc.available ? router.push(calc.path) : null}
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                borderColor: calc.available ? theme.colors.outline : 'transparent',
                opacity: calc.available ? 1 : 0.6,
              },
            ]}
            activeOpacity={calc.available ? 0.7 : 1}
            accessibilityLabel={`${calc.available ? 'Open' : 'Coming soon'} ${calc.title} calculator`}
            accessibilityRole="button"
            accessibilityState={{ disabled: !calc.available }}
          >
            <View style={[styles.iconContainer, { backgroundColor: calc.color + '15' }]}>
              <Ionicons name={calc.icon} size={24} color={calc.color} />
            </View>
            <View style={styles.cardContent}>
              <Text
                variant="titleMedium"
                style={{ color: theme.colors.onSurface, fontWeight: '600' }}
              >
                {calc.title}
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}
              >
                {calc.available ? calc.description : 'Coming soon'}
              </Text>
            </View>
            {calc.available && (
              <Ionicons name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  contentTablet: {
    paddingHorizontal: 64,
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: 4,
    fontWeight: '700',
  },
  subheader: {
    marginBottom: 20,
  },
  grid: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
});
