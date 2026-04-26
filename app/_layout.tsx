import '../src/styles/global.css';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="lookup/index" options={{ title: 'Property Lookup' }} />
        <Stack.Screen name="result/[id]" options={{ title: 'Calculation Result' }} />
      </Stack>
    </PaperProvider>
  );
}
