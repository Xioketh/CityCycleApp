import React from 'react';
import { View, StyleSheet } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';

const MapScreen = () => {
    const bikeStations = [
        { id: 1, latitude: 37.7749, longitude: -122.4194, name: "Station 1" },
        { id: 2, latitude: 37.7849, longitude: -122.4094, name: "Station 2" },
    ];

    return (
        <View style={styles.container}>
            <text>Test</text>
            {/*<MapView style={styles.map} initialRegion={{*/}
            {/*    latitude: 37.7749,*/}
            {/*    longitude: -122.4194,*/}
            {/*    latitudeDelta: 0.0922,*/}
            {/*    longitudeDelta: 0.0421,*/}
            {/*}}>*/}
            {/*    {bikeStations.map(station => (*/}
            {/*        <Marker key={station.id} coordinate={{ latitude: station.latitude, longitude: station.longitude }} title={station.name} />*/}
            {/*    ))}*/}
            {/*</MapView>*/}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { width: '100%', height: '100%' }
});

export default MapScreen;
