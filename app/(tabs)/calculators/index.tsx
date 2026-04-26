import { StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, List } from 'react-native-paper';
import { router } from 'expo-router';

export default function CalculatorsScreen() {
  const theme = useTheme();

  const calculators = [
    { title: 'Mortgage', path: '/calculators/mortgage' as const, icon: 'home', available: true },
    { title: 'ROI / Cash-on-Cash', path: '/calculators/roi' as const, icon: 'cash', available: true },
    { title: 'Cap Rate', path: '/calculators/cap-rate' as const, icon: 'percent', available: true },
    { title: 'Rent vs Buy', path: '/calculators/rent-vs-buy' as const, icon: 'swap-horizontal', available: false },
    { title: 'Fix & Flip', path: '/calculators/fix-flip' as const, icon: 'hammer', available: false },
    { title: 'Compare', path: '/calculators/compare' as const, icon: 'git-compare', available: false },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text
        variant="headlineMedium"
        style={[styles.header, { color: theme.colors.onBackground }]}
      >
        Calculators
      </Text>
      {calculators.map((calc) => (
        <List.Item
          key={calc.title}
          title={calc.title}
          description={!calc.available ? 'Coming soon' : undefined}
          left={(props) => <List.Icon {...props} icon={calc.icon} />}
          onPress={() => calc.available ? router.push(calc.path) : null}
          style={[styles.item, !calc.available && styles.disabled]}
          accessibilityLabel={`${calc.available ? 'Open' : 'Coming soon'} ${calc.title} calculator`}
          accessibilityRole="button"
          accessibilityState={{ disabled: !calc.available }}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
    fontWeight: '700',
  },
  item: {
    paddingVertical: 4,
  },
  disabled: {
    opacity: 0.5,
  },
});
