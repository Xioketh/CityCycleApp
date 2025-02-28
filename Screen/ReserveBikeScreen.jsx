import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { collection, getDocs, getFirestore, doc, updateDoc, addDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const db = getFirestore();

const ReserveBikeScreen = () => {
    const [bikes, setBikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reservedBike, setReservedBike] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [user_id, setUser_id] = useState('');

    useEffect(() => {
        fetchBikes();
    }, []);

    const fetchBikes = async () => {
        try {
            const role = await AsyncStorage.getItem('role');
            const uid = await AsyncStorage.getItem('userId');
            if (role) {
                setUserRole(role);
                setUser_id(uid);
            }

            const querySnapshot = await getDocs(collection(db, 'bikes'));
            const bikeList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setBikes(bikeList);
        } catch (error) {
            console.error('Error fetching bikes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReserve = async (bikeId) => {
        try {
            const bikeRef = doc(db, 'bikes', bikeId);
            await updateDoc(bikeRef, {
                status: false,
                reserved_user_id: user_id,
            });

            await addDoc(collection(db, 'rental_history'), {
                bike_id: bikeId,
                from: new Date().toISOString().split('T').join(' ').slice(0, 19),
                status: 0,
                fees: 0,
                to: null,
                user_id: user_id,
            });

            setReservedBike(bikeId);
            alert('Bike Reserved Successfully!');
            fetchBikes();
        } catch (error) {
            console.error('Error reserving bike:', error);
        }
    };

    const renderBikeItem = ({ item }) => (
        <View style={styles.bikeCard}>
            <Image source={{ uri: item.image }} style={styles.bikeImage} />
            <View style={styles.bikeDetails}>
                <Text style={styles.bikeBrand}>{item.brand_name}</Text>
                <Text style={styles.bikeLocation}>{item.location}</Text>
                <Text style={styles.bikePrice}>Per Day: Rs.{item.rental}</Text>
                <Text style={styles.bikeStatus}>Status: {item.status ? 'Available' : 'Reserved'}</Text>
            </View>
            {userRole === 'user' && (
                <TouchableOpacity
                    style={[styles.reserveButton, !item.status && styles.buttonDisabled]}
                    onPress={() => handleReserve(item.id)}
                    disabled={!item.status}
                >
                    <Text style={styles.buttonText}>{item.status ? 'Reserve' : 'Reserved'}</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />;
    }

    if (!bikes.length) return <Text style={styles.noBikesText}>No bikes available.</Text>;

    return (
        <View style={styles.container}>
            <FlatList
                data={bikes}
                renderItem={renderBikeItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    bikeCard: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
        margin: 8,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    bikeImage: {
        width: '100%',
        height: 140,
        borderRadius: 8,
        marginBottom: 10,
    },
    bikeDetails: {
        marginBottom: 10,
    },
    bikeBrand: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    bikeLocation: {
        fontSize: 14,
        color: '#666',
    },
    bikePrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007BFF',
    },
    bikeStatus: {
        fontSize: 14,
        fontWeight: '500',
        color: '#28a745',
    },
    reserveButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noBikesText: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
});

export default ReserveBikeScreen;
