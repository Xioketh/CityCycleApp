import React, { useState, useEffect } from 'react';
import {View, Button, Text, FlatList, StyleSheet, Image, ActivityIndicator} from 'react-native';
import { collection, getDocs, getFirestore, doc, updateDoc, addDoc } from "firebase/firestore";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
// import Toast from "react-native-toast-message";

const db = getFirestore(); // Initialize Firestore

const ReserveBikeScreen = () => {
    const [bikes, setBikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reservedBike, setReservedBike] = useState(null);
    let [user_role, setUser_role] = useState(null);


    useEffect(() => {
        fetchBikes();
    }, []);

    const fetchBikes = async () => {
        try {
            user_role = await asyncStorage.getItem('role')

            console.log('user_role:: '+user_role)
            console.log("Fetching bikes from Firestore...");
            const querySnapshot = await getDocs(collection(db, "bikes"));
            const bikeList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setBikes(bikeList);
            console.log("Bikes fetched successfully!");
        } catch (error) {
            console.error("Error fetching bikes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReserve = async (bikeId) => {
        try {
            // Reference to the bike document
            const bikeRef = doc(db, "bikes", bikeId);

            const user_id = await asyncStorage.getItem('userId')
            // Update Firestore document
            await updateDoc(bikeRef, {
                status: false,
                reserved_user_id: user_id
            });

            await addDoc(collection(db,"rental_history"),{
                bike_id:bikeId,
                from: new Date().toISOString().split("T").join(" ").slice(0, 19),
                status: 0,
                to:null,
                user_id: user_id,
            })

            // Set reserved bike state
            setReservedBike(bikeId);
            console.log(`Bike with ID ${bikeId} reserved!`);
            alert('Reserved Bike!')
            // Toast.show({
            //     type: 'success',
            //     text1: 'Bike Reserved!',
            //     text2: `Bike has  been reserved successfully.`,
            // });
            fetchBikes();
        } catch (error) {
            console.error("Error reserving bike:", error);
        }
    };

    const renderBikeItem = ({ item }) => (
        <View style={styles.bikeCard}>  {/* Changed to bikeCard */}
            <Image
                source={{ uri: item.image }}
                style={styles.bikeImage}
            />
            <View style={styles.bikeDetails}>
                <Text style={styles.bikeBrand}>{item.brand_name}</Text>
                <Text>{item.location}</Text>
                <Text>Per Day: Rs.{item.rental}</Text>
                <Text>Status: {item.status  ? "Available" : "Reserved"}</Text>
            </View>

            {user_role === 'user' ? (
                <Button
                    title={item.status ? "Reserve" : "Reserved"} // More descriptive button text
                    onPress={() => handleReserve(item.id, item.rental)}
                    disabled={!item.status} // Disable if reserved
                />
            ):null}


        </View>
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff"/>;
    }

    if (!bikes.length) return <Text>No bikes available.</Text>;

    return (
        <View style={styles.container}>
            <FlatList
                data={bikes}
                renderItem={renderBikeItem}
                keyExtractor={(item) => item.id}
                numColumns={2} // Display bikes in two columns
                columnWrapperStyle={styles.columnWrapper} // Style the rows
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f0f0f0', // Light background color
    },
    columnWrapper: { // Style for the rows
        flex: 1,
        justifyContent: 'space-around', // Space items evenly in the row
        marginVertical: 8, // Add some vertical margin between rows
    },
    bikeCard: {  // Card-like styling
        flex: 1, // Important for two columns
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        margin: 8, // Margin between cards
        elevation: 3, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    bikeImage: {
        width: '100%', // Image takes full width of the card
        height: 150,
        resizeMode: 'cover', // Or 'contain' as needed
        marginBottom: 8,
        borderRadius: 8, // Image border radius
    },
    bikeDetails: { // Style for the text details
        marginBottom: 8,
    },
    bikeBrand: {  // Style the brand name
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
});

export default ReserveBikeScreen;
