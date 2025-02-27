import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform, TextInput, TouchableOpacity
} from 'react-native';
import { collection, getFirestore, addDoc } from "firebase/firestore";

const db = getFirestore(); // Initialize Firestore

const AddBikeScreen = ({ navigation: any }) => {
    const [brand_name, setBrand_name] = useState("");
    const [bike_register_number, setBike_register_number] = useState("");
    const [location, setLocation] = useState("");
    const [rental, setRental] = useState("");

    const handleSaveBike = async () => {
        try {
            await addDoc(collection(db,"bikes"),{
                brand_name:brand_name,
                bike_register_number: bike_register_number,
                location: location,
                rental: rental,
                status: true,
                image: "https://imgd.aeplcdn.com/664x374/n/bw/models/colors/yamaha-select-model-matte-black-1704795170909.png?q=80",
            })

            alert("Bike Added Successful!");
            navigation.navigate("Home");
        } catch (error) {
            alert("Fail");
        }
    };


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.formContainer}>
                <Text style={styles.title}>Register</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Brand Name"
                    value={brand_name}
                    onChangeText={setBrand_name}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Bike Register Number"
                    value={bike_register_number}
                    onChangeText={setBike_register_number}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Bike Location"
                    value={location}
                    onChangeText={setLocation}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Rental fee per Day"
                    value={rental}
                    onChangeText={setRental}
                    keyboardType="phone-pad"
                />

                <TouchableOpacity style={styles.button} onPress={handleSaveBike}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>

            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0", // Light background
        padding: 20,
    },
    formContainer: {
        width: "100%", // Full width
        backgroundColor: "white", // White form background
        borderRadius: 8,
        padding: 20,
        elevation: 5, // For Android shadow
        shadowColor: "#000", // For iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#333", // Darker text
    },
    input: {
        backgroundColor: "#eee", // Light input background
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    button: {
        backgroundColor: "#007bff", // Blue button
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    loginButton: {
        alignItems: "center",
    },
    loginButtonText: {
        color: "blue",
        textDecorationLine: "underline",
    },
});

export default AddBikeScreen;
