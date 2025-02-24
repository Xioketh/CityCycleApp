import React, { useState, useEffect } from 'react';
import { View, Button, Text, FlatList, StyleSheet, Image } from 'react-native';
import { collection, getDocs, getFirestore } from "firebase/firestore";

const db = getFirestore(); // Initialize Firestore

const ReserveBikeScreen = () => {
    const [bikes, setBikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reservedBike, setReservedBike] = useState(null);

    useEffect(() => {
        const fetchBikes = async () => {
            try {
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

        fetchBikes();
    }, []);

    // Log when `bikes` state updates
    useEffect(() => {
        console.log("Updated bikes list:", bikes);
    }, [bikes]);

    const handleReserve = (bikeId) => {
        setReservedBike(bikeId);
        console.log(`Bike with ID ${bikeId} reserved!`);
    };

    const renderBikeItem = ({ item }) => (
        <View style={styles.bikeCard}>  {/* Changed to bikeCard */}
            <Image
                source={{ uri: item.image }}
                style={styles.bikeImage}
            />
            <View style={styles.bikeDetails}> {/* New container for details */}
                <Text style={styles.bikeBrand}>{item.brand_name}</Text> {/* Style the brand */}
                <Text>{item.location}</Text> {/* Add location */}
                <Text>Status: {item.status  ? "Available" : "Reserved"}</Text> {/* Display status */}
            </View>
            <Button
                title={item.status ? "Reserve" : "Reserved"} // More descriptive button text
                onPress={() => handleReserve(item.id)}
                disabled={!item.status} // Disable if reserved
            />
        </View>
    );

    if (loading) return <Text>Loading bikes...</Text>;
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
