import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';

import { styles } from '../../styles/app.styles';
import type { Event } from '../../types/event';
import { EventCard } from './EventCard';
import { EventDetailsModal } from './EventDetailsModal';
import { useSavedEvents } from './use-saved-events';

export default function SavedScreen() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [savedSubTab, setSavedSubTab] = useState<'Upcoming' | 'Past'>('Upcoming');
  const { savedEvents } = useSavedEvents();
  const events = savedSubTab === 'Upcoming' ? savedEvents : [];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Saved Events</Text>
      <View style={styles.tabRow}>
        {(['Upcoming', 'Past'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.subTab, savedSubTab === tab && styles.subTabActive]}
            onPress={() => setSavedSubTab(tab)}>
            <Text style={[styles.subTabText, savedSubTab === tab && styles.subTabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventCard event={item} onPress={setSelectedEvent} showDate />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No {savedSubTab.toLowerCase()} saved events found.</Text>
        }
      />
      <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </SafeAreaView>
  );
}
