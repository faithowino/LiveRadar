import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import type { ComponentRef } from 'react';

import { SAMPLE_EVENTS } from '../../data/sample-events';
import { styles } from '../../styles/app.styles';
import type { Event } from '../../types/event';
import { CategoryChips } from './CategoryChips';
import { EventDetailsModal } from './EventDetailsModal';
import {
  findLocation,
  getCurrentLocation,
  getLocationPermissionStatus,
  requestLocationPermission,
  type UserLocation,
} from './location';
import { RadarMap } from './RadarMap';

const DEFAULT_LOCATION: UserLocation = {
  latitude: 42.444,
  longitude: -76.5019,
};

export default function RadarScreen() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [permissionExplanationVisible, setPermissionExplanationVisible] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [manualLocation, setManualLocation] = useState('');
  const [locationError, setLocationError] = useState<string | null>(null);
  const searchInputRef = useRef<ComponentRef<typeof TextInput>>(null);

  useEffect(() => {
    const loadLocation = async () => {
      const permission = await getLocationPermissionStatus();

      if (permission.granted) {
        setLocation(await getCurrentLocation());
      } else {
        setPermissionExplanationVisible(true);
      }

      setLocationLoading(false);
    };

    loadLocation().catch(() => {
      setLocationError('We could not retrieve your location. You can enter a city manually.');
      setLocationLoading(false);
      setPermissionExplanationVisible(true);
    });
  }, []);

  const useCurrentLocation = async (): Promise<UserLocation | null> => {
    setLocationLoading(true);
    setLocationError(null);
    try {
      const permission = await requestLocationPermission();

      if (!permission.granted) {
        setLocationError('Location access was not granted. Enter a city to explore nearby events.');
        setPermissionExplanationVisible(false);
        searchInputRef.current?.focus();
        return null;
      }

      const nextLocation = await getCurrentLocation();
      setLocation(nextLocation);
      setPermissionExplanationVisible(false);
      return nextLocation;
    } catch {
      setLocationError('We could not retrieve your location. You can enter a city manually.');
      setPermissionExplanationVisible(false);
      searchInputRef.current?.focus();
      return null;
    } finally {
      setLocationLoading(false);
    }
  };

  const useManualLocation = async () => {
    if (!manualLocation.trim()) {
      setLocationError('Enter a city or address to search.');
      return;
    }

    setLocationLoading(true);
    setLocationError(null);
    try {
      const nextLocation = await findLocation(manualLocation);

      if (!nextLocation) {
        setLocationError('We could not find that place. Try a nearby city or address.');
        return;
      }

      setLocation(nextLocation);
    } catch {
      setLocationError('Manual location search is unavailable right now. Try again later.');
    } finally {
      setLocationLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <RadarMap location={location} onMyLocation={useCurrentLocation} />
        <View style={styles.radarOverlay}>
          <Text style={styles.headerTitle}>LiveRadar</Text>
          <TextInput
            ref={searchInputRef}
            style={styles.searchBar}
            value={manualLocation}
            onChangeText={setManualLocation}
            onSubmitEditing={useManualLocation}
            placeholder="Search events or enter a city..."
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
      <Modal
        visible={permissionExplanationVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPermissionExplanationVisible(false)}
      >
        <View style={styles.permissionBackdrop}>
          <View style={styles.permissionCard}>
            <Text style={styles.permissionTitle}>Find what's happening near you</Text>
            <Text style={styles.permissionText}>
              Allow LiveRadar to use your location so we can show nearby events, experiences, and activities.
            </Text>
            {locationLoading ? (
              <ActivityIndicator color="#7A5CFF" />
            ) : (
              <>
                <TouchableOpacity style={styles.permissionPrimaryButton} onPress={useCurrentLocation}>
                  <Text style={styles.permissionPrimaryButtonText}>Allow location access</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.permissionSecondaryButton}
                  onPress={() => {
                    setPermissionExplanationVisible(false);
                    searchInputRef.current?.focus();
                  }}
                >
                  <Text style={styles.permissionSecondaryButtonText}>Enter location manually</Text>
                </TouchableOpacity>
              </>
            )}
            {locationError && <Text style={styles.locationError}>{locationError}</Text>}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
