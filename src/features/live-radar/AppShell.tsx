import { Slot } from 'expo-router';
import { View } from 'react-native';

import BottomNavigation from './BottomNavigation';

export default function AppShell() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
      <BottomNavigation />
    </View>
  );
}
