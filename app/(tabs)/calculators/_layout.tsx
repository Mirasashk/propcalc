import { Stack } from 'expo-router';

export default function CalculatorsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'Calculators' }}
      />
      <Stack.Screen
        name="mortgage"
        options={{ title: 'Mortgage Calculator' }}
      />
    </Stack>
  );
}
