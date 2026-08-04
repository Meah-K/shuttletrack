import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import type { Shuttle, ShuttleStatus } from '../mockData';

interface CampusCenter {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface Props {
  shuttleData: Shuttle[];
  campusCenter: CampusCenter;
  getMarkerColor: (status: ShuttleStatus) => string;
  getStatusLabel: (status: ShuttleStatus) => string;
  onMarkerPress: (shuttle: Shuttle) => void;
}

export default function ShuttleMapView({
  shuttleData,
  campusCenter,
  getMarkerColor,
  getStatusLabel,
  onMarkerPress,
}: Props): React.JSX.Element {
  return (
    <MapView
      style={styles.map}
      initialRegion={campusCenter}
      showsUserLocation={true}
      showsMyLocationButton={false}
    >
      {shuttleData.map((shuttle) => (
        <Marker
          key={shuttle.shuttleId}
          coordinate={{ latitude: shuttle.latitude, longitude: shuttle.longitude }}
          pinColor={getMarkerColor(shuttle.status)}
          title={shuttle.routeName}
          description={getStatusLabel(shuttle.status)}
          onPress={() => onMarkerPress(shuttle)}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
});