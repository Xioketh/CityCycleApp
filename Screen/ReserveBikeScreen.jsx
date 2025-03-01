import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, Image, ActivityIndicator, TouchableOpacity} from 'react-native';
import {collection, getDocs, getFirestore, doc, updateDoc, addDoc} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from "react-native-toast-message";

const db = getFirestore();

const ReserveBikeScreen = () => {

    const [bikes, setBikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reserving, setReserving] = useState(false);
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
            setReserving(true);
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
            Toast.show({
                type: "success",
                text1: "You have successfully reserved this bike.",
                text2: "",
                position: "top",
            });
            fetchBikes();
        } catch (error) {
            console.error('Error reserving bike:', error);
        } finally {
            setReserving(false);
        }
    };

    const renderBikeItem = ({item}) => (
        <View style={styles.container}>
            <View style={styles.card}>
                <Image source={{uri: item.image}} style={styles.bikeImage}/>
                <Text style={styles.bikeBrand}>{item.brand_name}</Text>
                <Text style={styles.bikeLocation}>Location: {item.location}</Text>
                <Text style={styles.bikePrice}>Per Day: Rs.{item.rental}</Text>
                {item.status ? (
                    <Text style={styles.bikeStatus}>Available</Text>
                ) : (
                    <Text style={styles.unavailableText}>Reserved</Text>
                )}
                {userRole === 'user' && (
                    <TouchableOpacity
                        style={[styles.reserveButton, !item.status && styles.buttonDisabled]}
                        onPress={() => handleReserve(item.id)}
                        disabled={!item.status || reserving}
                    >
                        <Text style={styles.buttonText}>{item.status ? 'Reserve' : 'Reserved'}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#007BFF" style={styles.loader}/>;
    }

    if (!bikes.length) return <Text style={styles.noBikesText}>No bikes available.</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Available Bikes</Text>
            <FlatList
                data={bikes}
                renderItem={renderBikeItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#e0f7fa',
        flex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        color: '#007bff',
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    bikeCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
        marginVertical: 8, // Added vertical margin
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    bikeImage: {
        width: '100%',
        height: 180, // Increased height for better view
        borderRadius: 8,
        marginBottom: 10,
    },
    bikeBrand: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    bikeLocation: {
        fontSize: 14,
        color: '#666',
        marginBottom: 3,
    },
    bikePrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007BFF',
        marginBottom: 3,
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
    unavailableText: {
        fontSize: 14,
        color: 'red',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    bikeStatus: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#28a745',
        marginBottom: 10,
    },
});

export default ReserveBikeScreen;
