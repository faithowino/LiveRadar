import { useEffect, useRef } from 'react';
import MapView, { type Region } from 'react-native-maps';
import { Text, TouchableOpacity, View } from 'react-native';

import type { UserLocation } from './location';
import { styles } from '../../styles/app.styles';

type Props = {
  location: UserLocation;
  onMyLocation: () => Promise<UserLocation | null>;
};

const REGION_DELTAS = {
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
};

export function RadarMap({ location, onMyLocation }: Props) {
  const mapRef = useRef<MapView>(null);

  const region: Region = {
    ...location,
    ...REGION_DELTAS,
  };

  useEffect(() => {
    mapRef.current?.animateToRegion(region, 500);
  }, [location]);

  const recenter = async () => {
    const nextLocation = await onMyLocation();

    if (nextLocation) {
      mapRef.current?.animateToRegion(
        {
          ...nextLocation,
          ...REGION_DELTAS,
        },
        500,
      );
    }
  };

  return (
    <View style={styles.mapContainer}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        showsCompass
        showsUserLocation
        showsMyLocationButton={false}
      />
      <TouchableOpacity style={styles.myLocationButton} onPress={recenter}>
        <Text style={styles.myLocationButtonText}>My Location</Text>
      </TouchableOpacity>
    </View>
  );
}
