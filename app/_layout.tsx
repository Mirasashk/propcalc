import '../src/styles/global.css';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { propCalcLightTheme, propCalcDarkTheme } from '@/styles/theme';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? propCalcDarkTheme : propCalcLightTheme;

  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="lookup/index" options={{ title: 'Property Lookup' }} />
        <Stack.Screen name="result/[id]" options={{ title: 'Calculation Result' }} />
      </Stack>
    </PaperProvider>
  );
}
