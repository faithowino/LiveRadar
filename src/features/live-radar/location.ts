import * as Location from 'expo-location';

export type UserLocation = {
  latitude: number;
  longitude: number;
};

export async function getLocationPermissionStatus() {
  return Location.getForegroundPermissionsAsync();
}

export async function requestLocationPermission() {
  return Location.requestForegroundPermissionsAsync();
}

export async function getCurrentLocation(): Promise<UserLocation> {
  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}

export async function findLocation(query: string): Promise<UserLocation | null> {
  const results = await Location.geocodeAsync(query.trim());
  const firstResult = results[0];

  if (!firstResult) {
    return null;
  }

  return {
    latitude: firstResult.latitude,
    longitude: firstResult.longitude,
  };
}
