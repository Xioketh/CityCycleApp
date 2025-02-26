import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

const HomeScreen = ({ navigation }) => {

    const handleReserveBike = () => {
        navigation.navigate('Reserve');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Bike Rental</Text>

            <TouchableOpacity style={styles.button} onPress={handleReserveBike}>
                <Text style={styles.buttonText}>Reserve a Bike</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RentalHistory')}>
                <Text style={styles.buttonText}>Rental History</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PersonalInfo')}>
                <Text style={styles.buttonText}>Personal Information</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logOutbutton} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f0f0', // Light background color

    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333', // Darker text color
    },
    button: {
        backgroundColor: '#007bff', // Blue button color
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 15,
        width: '100%', // Make buttons wider
        alignItems: 'center', // Center text within button
    },
    logOutbutton: {
        backgroundColor: '#ac022d', // Blue button color
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 15,
        width: '100%', // Make buttons wider
        alignItems: 'center', // Center text within button
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default HomeScreen;
