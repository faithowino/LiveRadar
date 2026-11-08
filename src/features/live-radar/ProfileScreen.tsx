import { SafeAreaView, Text, View } from 'react-native';

import { styles } from '../../styles/app.styles';
import { useSavedEvents } from './use-saved-events';

export default function ProfileScreen() {
  const { savedEvents } = useSavedEvents();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Profile</Text>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>FO</Text>
        </View>
        <Text style={styles.profileName}>Faith Owino</Text>
        <Text style={styles.profileBio}>
          Exploring local culture, live music, and community pop-ups in Ithaca.
        </Text>
        <Text style={styles.profileLocation}>Ithaca, NY</Text>
      </View>
      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <Text style={styles.infoText}>Saved Events ({savedEvents.length})</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoText}>Notification Settings</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoText}>Account Details</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
