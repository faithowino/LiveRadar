import { FlatList, SafeAreaView, Text, TextInput } from 'react-native';
import { useMemo, useState } from 'react';

import { SAMPLE_EVENTS } from '../../data/sample-events';
import { styles } from '../../styles/app.styles';
import type { Event } from '../../types/event';
import { CategoryChips } from './CategoryChips';
import { EventCard } from './EventCard';
import { EventDetailsModal } from './EventDetailsModal';

export default function ExploreScreen() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const events = useMemo(
    () =>
      SAMPLE_EVENTS.filter(
        (event) =>
          (category === 'All' || event.category === category) &&
          `${event.name} ${event.location}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [category, query],
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Explore</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search categories or venues..."
        placeholderTextColor="#A0988E"
        value={query}
        onChangeText={setQuery}
      />
      <CategoryChips
        categories={['All', 'Music', 'Arts', 'Community']}
        selected={category}
        onChange={setCategory}
      />
      <Text style={styles.sectionHeading}>Near You</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventCard event={item} onPress={setSelectedEvent} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No events found.</Text>}
      />
      <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </SafeAreaView>
  );
}
