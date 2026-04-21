import { StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, List } from 'react-native-paper';
import { router } from 'expo-router';

export default function CalculatorsScreen() {
  const theme = useTheme();

  const calculators = [
    { title: 'Mortgage', path: '/calculators/mortgage', icon: 'home' },
    { title: 'ROI / Cash-on-Cash', path: '/calculators/roi', icon: 'cash' },
    { title: 'Cap Rate', path: '/calculators/cap-rate', icon: 'percent' },
    { title: 'Rent vs Buy', path: '/calculators/rent-vs-buy', icon: 'swap-horizontal' },
    { title: 'Fix & Flip', path: '/calculators/fix-flip', icon: 'hammer' },
    { title: 'Compare', path: '/calculators/compare', icon: 'git-compare' },
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
          left={(props) => <List.Icon {...props} icon={calc.icon} />}
          onPress={() => router.push(calc.path)}
          style={styles.item}
          accessibilityLabel={`Open ${calc.title} calculator`}
          accessibilityRole="button"
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
});
