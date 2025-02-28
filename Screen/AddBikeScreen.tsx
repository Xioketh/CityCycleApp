import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { collection, getFirestore, addDoc } from "firebase/firestore";

const db = getFirestore();

const AddBikeScreen = ({ navigation }) => {
    const [brand_name, setBrand_name] = useState("");
    const [bike_register_number, setBike_register_number] = useState("");
    const [location, setLocation] = useState("");
    const [rental, setRental] = useState("");

    const handleSaveBike = async () => {
        try {
            await addDoc(collection(db, "bikes"), {
                brand_name,
                bike_register_number,
                location,
                rental,
                status: true,
                image: "https://imgd.aeplcdn.com/664x374/n/bw/models/colors/yamaha-select-model-matte-black-1704795170909.png?q=80",
            });

            alert("Bike Added Successfully!");
            navigation.navigate("Home");
        } catch (error) {
            alert("Failed to add bike.");
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Add New Bike</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Brand Name"
                        value={brand_name}
                        onChangeText={setBrand_name}
                        placeholderTextColor="#666"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Bike Register Number"
                        value={bike_register_number}
                        onChangeText={setBike_register_number}
                        placeholderTextColor="#666"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Bike Location"
                        value={location}
                        onChangeText={setLocation}
                        placeholderTextColor="#666"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Rental fee per Day"
                        value={rental}
                        onChangeText={setRental}
                        keyboardType="numeric"
                        placeholderTextColor="#666"
                    />

                    <TouchableOpacity style={styles.button} onPress={handleSaveBike}>
                        <Text style={styles.buttonText}>Save Bike</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    formContainer: {
        width: "100%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#343a40",
    },
    input: {
        backgroundColor: "#f1f3f5",
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
        color: "#333",
    },
    button: {
        backgroundColor: "#007bff",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default AddBikeScreen;
