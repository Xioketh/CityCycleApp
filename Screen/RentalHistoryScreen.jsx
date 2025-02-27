import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image} from 'react-native';
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
            const userId =  await AsyncStorage.getItem('userId');
            console.log("userId:: "+userId)
            const q = query(collection(db, "rental_history"), where("user_id", "==", userId));
            const querySnapshot = await getDocs(q);

            const rentalHistory = await Promise.all(
                querySnapshot.docs.map(async (docSnapshot) => {
                    const rentalData = docSnapshot.data();
                    const bikeRef = doc(db, "bikes", rentalData.bike_id);
                    const bikeSnapshot = await getDoc(bikeRef);

                    return {
                        id: docSnapshot.id,
                        ...rentalData,
                        bike: bikeSnapshot.exists() ? bikeSnapshot.data() : null, // Attach bike details
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
        console.log('im here!!!!!!!!!!!')
        console.log(item)
        const rentalFeePerDay = item.bike?.rental;

        const rentFrom = new Date(item.from); // Convert to Date object
        const rentTo = new Date(); // Current Date & Time

        // Calculate the difference in milliseconds
        const timeDiff = rentTo - rentFrom;
        const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        const totalRentalFee = dayDiff * rentalFeePerDay;

        console.log(`Total Days: ${dayDiff}, Total Rental Fee: $${totalRentalFee}`);

        console.log('item.bike_id:: '+item.bike_id)
        const rentalHistoryRef = doc(db, "rental_history", item.id);
        const bikeRef = doc(db, "bikes", item.bike_id);

        // Update Firestore document
        await updateDoc(rentalHistoryRef, {
            status: 1,
            fees: totalRentalFee,
            to: new Date().toISOString().split("T").join(" ").slice(0, 19)
        });

        await updateDoc(bikeRef, {
            status: true,
            reserved_user_id: null
        });

        alert('Rental Complete')
        fetchHistoryWithBikeDetails();
    }

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff"/>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rental History</Text>
            {history.length > 0 ? (
                history.map((item) => (
                    <View key={item.id} style={styles.card}>
                        <Image
                            source={{ uri: item.bike?.image }}
                            style={styles.bikeImage}
                        />
                        <Text style={styles.bikeBrand}>{item.bike?.brand_name || "Unknown Bike"}</Text>
                        <Text>Location: {item.bike?.location || "Unknown"}</Text>
                        <Text>Rental Date: {new Date(item.from).toLocaleDateString()}</Text>

                        {item.status === 1 ? (
                            <View>
                                <Text>Completed On: {new Date(item.to).toLocaleDateString()}</Text>
                                <Text>Status: Completed</Text>
                                <Text>Total Rental Fee: Rs.{item.fees}</Text>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.button} onPress={() => updateRentalStatus(item)}>
                                <Text style={styles.buttonText}>Complete Rental</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))
            ) : (
                <Text>No rental history found.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#007bff", // Blue button
        paddingVertical: 6,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10,
        marginTop: 10,
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    bikeBrand: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default RentalHistoryScreen;
