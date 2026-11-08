import { Modal, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import type { Event } from '../../types/event';
import { styles } from '../../styles/app.styles';

type Props = {
  event: Event | null;
  onClose: () => void;
};

export function EventDetailsModal({ event, onClose }: Props) {
  return (
    <Modal visible={event !== null} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.fullEventContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        {event && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.posterImage}>
              <Text style={styles.posterText}>{event.name}</Text>
            </View>
            <View style={styles.detailsBox}>
              <Text style={styles.cardCategory}>{event.category}</Text>
              <Text style={styles.cardTitle}>{event.name}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Date:</Text>
                <Text style={styles.metaVal}>{event.date}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Time:</Text>
                <Text style={styles.metaVal}>{event.time}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Location:</Text>
                <Text style={styles.metaVal}>{event.location}</Text>
              </View>
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.bodyText}>{event.about}</Text>
              <Text style={styles.sectionTitle}>More Info</Text>
              <Text style={styles.bodyText}>{event.moreInfo}</Text>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
}
