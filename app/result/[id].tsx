import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';

export default function ResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.onBackground }]}>Calculation Result</Text>
      <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>ID: {id ?? 'N/A'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
});
