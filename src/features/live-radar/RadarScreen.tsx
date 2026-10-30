import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';

import { SAMPLE_EVENTS } from '../../data/sample-events';
import { styles } from '../../styles/app.styles';
import type { Event } from '../../types/event';
import { CategoryChips } from './CategoryChips';
import { EventDetailsModal } from './EventDetailsModal';

export default function RadarScreen() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [category, setCategory] = useState('All');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapGridText}>[ Interactive Radar Map Area ]</Text>
        <View style={styles.radarOverlay}>
          <Text style={styles.headerTitle}>LiveRadar</Text>
          <TextInput
            style={styles.searchBar}
            placeholder="Search events in Ithaca..."
            placeholderTextColor="#A0988E"
          />
          <CategoryChips
            categories={['All', 'Music', 'Arts', 'Cook', 'Sports']}
            selected={category}
            onChange={setCategory}
          />
        </View>
        <TouchableOpacity style={styles.eventPreviewCard} onPress={() => setSelectedEvent(SAMPLE_EVENTS[0])}>
          <Text style={styles.cardCategory}>{SAMPLE_EVENTS[0].category}</Text>
          <Text style={styles.cardTitle}>{SAMPLE_EVENTS[0].name}</Text>
          <Text style={styles.cardSubText}>
            {SAMPLE_EVENTS[0].location} • {SAMPLE_EVENTS[0].time}
          </Text>
        </TouchableOpacity>
      </View>
      <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </SafeAreaView>
  );
}
