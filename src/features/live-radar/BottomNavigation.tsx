import { Ionicons } from '@expo/vector-icons';
import { Link, usePathname } from 'expo-router';
import { Text, View } from 'react-native';

import { styles } from '../../styles/app.styles';

const tabs = [
  { label: 'Radar', href: '/' as const, icon: 'map-outline' as const },
  { label: 'Explore', href: '/explore' as const, icon: 'search-outline' as const },
  { label: 'Saved', href: '/saved' as const, icon: 'heart-outline' as const },
  { label: 'Profile', href: '/profile' as const, icon: 'image-outline' as const },
];

export default function BottomNavigation() {
  const pathname = usePathname();
  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link key={tab.href} href={tab.href} style={styles.tabButton}>
            <Ionicons
              name={tab.icon}
              size={22}
              color={active ? '#7A5CFF' : '#8A847C'}
              style={styles.tabIcon}
            />
            <Text style={[styles.tabText, active && styles.activeTabText]}>{tab.label}</Text>
          </Link>
        );
      })}
    </View>
  );
}
