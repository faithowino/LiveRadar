import { Text, TouchableOpacity, View } from 'react-native';

import type { Event } from '../../types/event';
import { styles } from '../../styles/app.styles';

type Props = {
  event: Event;
  onPress: (event: Event) => void;
  showDate?: boolean;
};

export function EventCard({ event, onPress, showDate = false }: Props) {
  return (
    <TouchableOpacity style={styles.eventCard} onPress={() => onPress(event)}>
      <View style={styles.cardThumbnail} />
      <View style={styles.cardContent}>
        <Text style={styles.cardCategory}>{event.category}</Text>
        <Text style={styles.cardTitle}>{event.name}</Text>
        <Text style={styles.cardSubText}>
          {showDate ? `${event.date} • ${event.time}` : event.location}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
