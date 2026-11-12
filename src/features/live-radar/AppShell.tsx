import { Slot } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import BottomNavigation from './BottomNavigation';

export default function AppShell() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
      <BottomNavigation />
    </SafeAreaProvider>
  );
}
