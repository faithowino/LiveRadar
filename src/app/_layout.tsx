import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import AppShell from '../features/live-radar/AppShell';
import { SavedEventsProvider } from '../features/live-radar/use-saved-events';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <SavedEventsProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AppShell />
      </ThemeProvider>
    </SavedEventsProvider>
  );
}
