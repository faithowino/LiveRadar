import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useState } from 'react';
import { Modal, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { styles } from '../../styles/app.styles';
import type { Event } from '../../types/event';
import { useSavedEvents } from './use-saved-events';

type Props = {
  event: Event | null;
  onClose: () => void;
};

export function EventDetailsModal({ event, onClose }: Props) {
  const { savedEventIds, toggleSaved } = useSavedEvents();
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [directionsError, setDirectionsError] = useState(false);
  const isSaved = event ? savedEventIds.includes(event.id) : false;
  const hasMoreAboutText = event ? event.about.length > 150 : false;

  const openDirections = async () => {
    if (!event) return;

    const destination = encodeURIComponent(event.location);
    const url =
      Platform.OS === 'ios'
        ? `maps://?daddr=${destination}&dirflg=d`
        : `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      setDirectionsError(true);
      return;
    }

    await Linking.openURL(url);
  };

  return (
    <Modal visible={event !== null} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.fullEventContainer}>
        <View style={styles.detailsHeader}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          {event && (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => toggleSaved(event.id)}
              accessibilityLabel={isSaved ? 'Remove event from saved events' : 'Save event'}
            >
              <Ionicons
                name={isSaved ? 'heart' : 'heart-outline'}
                size={28}
                color="#E94F8A"
              />
            </TouchableOpacity>
          )}
        </View>
        {event && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.posterImage}>
              <Text style={styles.posterText}>{event.name}</Text>
            </View>
            <Text style={styles.detailsEventName}>{event.name}</Text>
            <View style={styles.highlightChips}>
              <View style={styles.highlightChip}>
                <Text style={styles.highlightChipText}>{event.category}</Text>
              </View>
              <View style={styles.highlightChip}>
                <Text style={styles.highlightChipText}>{event.price}</Text>
              </View>
            </View>
            <View style={styles.detailsBox}>
              <View style={styles.eventMetaColumns}>
                <View style={styles.eventMetaColumn}>
                  <Text style={styles.eventMetaTitle}>Date &amp; Time</Text>
                  <Text style={styles.metaVal}>{event.date}</Text>
                  <Text style={styles.metaVal}>{event.time}</Text>
                </View>
                <View style={styles.eventMetaDivider} />
                <View style={styles.eventMetaColumn}>
                  <Text style={styles.eventMetaTitle}>Location</Text>
                  <Text style={styles.metaVal}>{event.location}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.infoSection}
              onPress={() => hasMoreAboutText && setAboutExpanded(true)}
              accessibilityLabel="About this event"
            >
              <Text style={styles.detailsSectionTitle}>About this event</Text>
              <Text style={styles.bodyText} numberOfLines={hasMoreAboutText ? 3 : undefined}>
                {event.about}
              </Text>
              {hasMoreAboutText && <Text style={styles.readMoreText}>Read more</Text>}
            </TouchableOpacity>
            <View style={styles.eventActions}>
              <View style={[styles.highlightChip, styles.eventActionChip]}>
                <Text style={styles.highlightChipText}>{event.perk}</Text>
              </View>
              <View style={styles.eventActionRow}>
                <TouchableOpacity style={styles.directionsChip} onPress={openDirections}>
                  <Ionicons name="navigate-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.directionsChipText}>Get directions</Text>
                </TouchableOpacity>
              </View>
            </View>
            {directionsError && (
              <Text style={styles.locationError}>Directions are unavailable on this device.</Text>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
      <Modal
        visible={aboutExpanded && event !== null}
        animationType="fade"
        transparent
        onRequestClose={() => setAboutExpanded(false)}
      >
        <View style={styles.aboutModalBackdrop}>
          <View style={styles.aboutModalCard}>
            <View style={styles.aboutModalHeader}>
              <Text style={styles.detailsSectionTitle}>About this event</Text>
              <TouchableOpacity
                onPress={() => setAboutExpanded(false)}
                accessibilityLabel="Close about this event"
                style={styles.aboutCloseButton}
              >
                <Ionicons name="close" size={24} color="#2C2A29" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.bodyText}>{event?.about}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}
