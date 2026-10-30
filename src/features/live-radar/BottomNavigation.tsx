import { Link, usePathname } from 'expo-router';
import { Text, View } from 'react-native';

import { styles } from '../../styles/app.styles';

const tabs = [
  { label: 'Radar', href: '/' as const },
  { label: 'Explore', href: '/explore' as const },
  { label: 'Saved', href: '/saved' as const },
  { label: 'Profile', href: '/profile' as const },
];

export default function BottomNavigation() {
  const pathname = usePathname();
  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link key={tab.href} href={tab.href} style={styles.tabButton}>
            <Text style={[styles.tabText, active && styles.activeTabText]}>{tab.label}</Text>
          </Link>
        );
      })}
    </View>
  );
}
