import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="lookup" options={{ title: 'Property Lookup' }} />
        <Stack.Screen name="result" options={{ title: 'Calculation Result' }} />
      </Stack>
    </PaperProvider>
  );
}
