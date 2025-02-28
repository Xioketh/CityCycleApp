import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image, ScrollView} from 'react-native';
import {getFirestore, collection, getDocs, query, where, doc, getDoc, updateDoc} from 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";

const db = getFirestore();

const RentalHistoryScreen = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistoryWithBikeDetails();
    }, []);

    const fetchHistoryWithBikeDetails = async () => {
        try {
            const role =  await AsyncStorage.getItem('role');
            let q;

            if (role === 'user') {
                const userId = await AsyncStorage.getItem('userId');
                q = query(collection(db, "rental_history"), where("user_id", "==", userId));
            } else {
                q = query(collection(db, "rental_history"));
            }

            const querySnapshot = await getDocs(q);

            const rentalHistory = await Promise.all(
                querySnapshot.docs.map(async (docSnapshot) => {
                    const rentalData = docSnapshot.data();
                    const bikeRef = doc(db, "bikes", rentalData.bike_id);
                    const bikeSnapshot = await getDoc(bikeRef);

                    return {
                        id: docSnapshot.id,
                        ...rentalData,
                        bike: bikeSnapshot.exists() ? bikeSnapshot.data() : null,
                    };
                })
            );

            setHistory(rentalHistory);
        } catch (error) {
            console.error("Error fetching rental history:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateRentalStatus = async (item) => {
        const rentalFeePerDay = item.bike?.rental;
        const rentFrom = new Date(item.from);
        const rentTo = new Date();

        const timeDiff = rentTo - rentFrom;
        const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        const totalRentalFee = dayDiff * rentalFeePerDay;

        const rentalHistoryRef = doc(db, "rental_history", item.id);
        const bikeRef = doc(db, "bikes", item.bike_id);

        await updateDoc(rentalHistoryRef, {
            status: 1,
            fees: totalRentalFee,
            to: new Date().toISOString().split("T").join(" ").slice(0, 19)
        });

        await updateDoc(bikeRef, {
            status: true,
            reserved_user_id: null
        });

        alert('Rental Complete');
        fetchHistoryWithBikeDetails();
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#007bff" style={styles.loading} />;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Rental History</Text>
            {history.length > 0 ? (
                history.map((item) => (
                    <View key={item.id} style={styles.card}>
                        <Image source={{ uri: item.bike?.image }} style={styles.bikeImage} />
                        <Text style={styles.bikeBrand}>{item.bike?.brand_name || "Unknown Bike"}</Text>
                        <Text style={styles.infoText}>Location: {item.bike?.location || "Unknown"}</Text>
                        <Text style={styles.infoText}>Rental Date: {new Date(item.from).toLocaleDateString()}</Text>

                        {item.status === 1 ? (
                            <View>
                                <Text style={styles.infoText}>Completed On: {new Date(item.to).toLocaleDateString()}</Text>
                                <Text style={styles.infoText}>Status: <Text style={styles.completedText}>Completed</Text></Text>
                                <Text style={styles.infoText}>Total Rental Fee: Rs.{item.fees}</Text>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.button} onPress={() => updateRentalStatus(item)}>
                                <Text style={styles.buttonText}>Complete Rental</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))
            ) : (
                <Text style={styles.noHistoryText}>No rental history found.</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#e0f7fa',
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
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    bikeImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    bikeBrand: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    infoText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 3,
    },
    completedText: {
        fontWeight: 'bold',
        color: 'green',
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    noHistoryText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#555',
        marginTop: 20,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default RentalHistoryScreen;
