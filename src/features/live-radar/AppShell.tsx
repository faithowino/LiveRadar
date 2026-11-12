import { Slot } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { styles } from '../../styles/app.styles';
import BottomNavigation from './BottomNavigation';

export default function AppShell() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Slot />
        </View>
        <SafeAreaView edges={['bottom']} style={styles.bottomSafeArea}>
          <BottomNavigation />
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}
