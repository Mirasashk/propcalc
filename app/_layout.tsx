import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="lookup" options={{ title: 'Property Lookup' }} />
      <Stack.Screen name="result" options={{ title: 'Calculation Result' }} />
    </Stack>
  );
}
