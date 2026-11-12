import type { ComponentRef } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
import { RadarPulse } from './RadarPulse';

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
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [priceFilter, setPriceFilter] = useState<'Any price' | 'Free' | 'Paid'>('Any price');
  const [ageFilter, setAgeFilter] = useState<'Any age' | 'All ages' | '18+' | '21+'>('Any age');
  const [radiusMiles, setRadiusMiles] = useState(10);
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

  const filteredEvents = useMemo(
    () =>
      SAMPLE_EVENTS.filter(
        (event) =>
          (category === 'All' || event.category === category) &&
          (priceFilter === 'Any price' || event.price === priceFilter) &&
          (ageFilter === 'Any age' || event.age === ageFilter),
      ),
    [ageFilter, category, priceFilter],
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <RadarMap location={location} onMyLocation={useCurrentLocation} />
        <RadarPulse radiusMiles={radiusMiles} />
        <View style={styles.radarOverlay}>
          <View style={styles.radarHeaderRow}>
            <Text style={styles.headerTitle}>LiveRadar</Text>
            <TouchableOpacity
              accessibilityLabel="Open event filters"
              style={styles.filterButton}
              onPress={() => setFiltersVisible(true)}
            >
              <Ionicons name="options-outline" size={24} color="#E94F8A" />
            </TouchableOpacity>
          </View>
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
            categories={['All', 'Arts & Culture', 'Food', 'Sports & Fitness', "Volunteering", ]}
            selected={category}
            onChange={setCategory}
          />
        </View>
        {filteredEvents[0] ? (
          <TouchableOpacity style={styles.eventPreviewCard} onPress={() => setSelectedEvent(filteredEvents[0])}>
            <Text style={styles.cardCategory}>{filteredEvents[0].category}</Text>
            <Text style={styles.cardTitle}>{filteredEvents[0].name}</Text>
            <Text style={styles.cardSubText}>
              {filteredEvents[0].location} • {filteredEvents[0].time}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.eventPreviewCard}>
            <Text style={styles.emptyText}>No events match these filters.</Text>
          </View>
        )}
      </View>
      <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      <Modal
        visible={filtersVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFiltersVisible(false)}
      >
        <View style={styles.filterBackdrop}>
          <View style={styles.filterCard}>
            <View style={styles.filterTitleRow}>
              <Text style={styles.permissionTitle}>Filter events</Text>
              <TouchableOpacity onPress={() => setFiltersVisible(false)} accessibilityLabel="Close filters">
                <Ionicons name="close" size={24} color="#2C2A29" />
              </TouchableOpacity>
            </View>
            <Text style={styles.filterLabel}>Distance</Text>
            <View style={styles.filterOptions}>
              {[5, 10, 25, 50].map((miles) => (
                <TouchableOpacity
                  key={miles}
                  style={[styles.filterOption, radiusMiles === miles && styles.filterOptionActive]}
                  onPress={() => setRadiusMiles(miles)}
                >
                  <Text style={[styles.filterOptionText, radiusMiles === miles && styles.filterOptionTextActive]}>
                    {miles} mi
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.filterLabel}>Price</Text>
            <View style={styles.filterOptions}>
              {(['Any price', 'Free', 'Paid'] as const).map((price) => (
                <TouchableOpacity
                  key={price}
                  style={[styles.filterOption, priceFilter === price && styles.filterOptionActive]}
                  onPress={() => setPriceFilter(price)}
                >
                  <Text style={[styles.filterOptionText, priceFilter === price && styles.filterOptionTextActive]}>
                    {price}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.filterLabel}>Age</Text>
            <View style={styles.filterOptions}>
              {(['Any age', 'All ages', '18+', '21+'] as const).map((age) => (
                <TouchableOpacity
                  key={age}
                  style={[styles.filterOption, ageFilter === age && styles.filterOptionActive]}
                  onPress={() => setAgeFilter(age)}
                >
                  <Text style={[styles.filterOptionText, ageFilter === age && styles.filterOptionTextActive]}>
                    {age}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.permissionPrimaryButton} onPress={() => setFiltersVisible(false)}>
              <Text style={styles.permissionPrimaryButtonText}>Apply filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
