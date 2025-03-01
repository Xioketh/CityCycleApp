import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Image,
    Alert
} from 'react-native';
import { collection, getFirestore, addDoc } from "firebase/firestore";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_URL } from "../Config/cloudinaryConfig";

const db = getFirestore();

const AddBikeScreen = ({ navigation }) => {
    const [brand_name, setBrand_name] = useState("");
    const [bike_register_number, setBike_register_number] = useState("");
    const [location, setLocation] = useState("");
    const [rental, setRental] = useState("");
    const [loading, setLoading] = useState(false);

    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleImagePickAndUpload = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (result.canceled) return;
        setImage(result.assets[0].uri);
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', {
                uri: result.assets[0].uri,
                type: 'image/jpeg',
                name: `upload_${Date.now()}.jpg`,
            });
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

            const response = await fetch(CLOUDINARY_URL, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.secure_url) {
                setImage(data.secure_url);
                // Alert.alert('Upload successful', 'Image uploaded successfully!');
            } else {
                // Alert.alert('Upload failed', 'No URL returned from Cloudinary.');
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: 'Upload failed ,No URL returned from Cloudinary.',
                    position: "bottom",
                });
            }
        } catch (error) {
            // console.error('Upload failed:', error);
            // Alert.alert('Upload failed', error.message);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: error.message,
                position: "bottom",
            });
        } finally {
            setUploading(false);
        }
    };

    const handleSaveBike = async () => {
        if (!brand_name.trim() || brand_name.length < 3) {
            return Toast.show({
                type: "error",
                text1: "Validation Error",
                text2: "Brand Name must be at least 3 characters.",
                position: "bottom",
            });
        }

        if (!bike_register_number.trim() || !/^[a-zA-Z0-9\s-]+$/.test(bike_register_number)) {
            return Toast.show({
                type: "error",
                text1: "Validation Error",
                text2: "Bike Register Number must be alphanumeric.",
                position: "bottom",
            });
        }

        if (!location.trim()) {
            return Toast.show({
                type: "error",
                text1: "Validation Error",
                text2: "Bike Location is required.",
                position: "bottom",
            });
        }

        if (!rental.trim() || isNaN(rental) || parseFloat(rental) <= 0) {
            return Toast.show({
                type: "error",
                text1: "Validation Error",
                text2: "Rental fee must be a positive number.",
                position: "bottom",
            });
        }

        if (!image) {
            return Toast.show({
                type: "error",
                text1: "Validation Error",
                text2: "Please upload an image.",
                position: "bottom",
            });
        }

        try {
            setLoading(true);
            await addDoc(collection(db, "bikes"), {
                brand_name,
                bike_register_number,
                location,
                rental,
                status: true,
                image,
            });

            Toast.show({
                type: "success",
                text1: "Bike Added Successfully!",
                position: "top",
            });
            navigation.navigate("Home");
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Failed to add bike.",
                position: "bottom",
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Add New Bike</Text>

                    <TextInput style={styles.input} placeholder="Brand Name" value={brand_name} onChangeText={setBrand_name} placeholderTextColor="#666" />
                    <TextInput style={styles.input} placeholder="Bike Register Number" value={bike_register_number} onChangeText={setBike_register_number} placeholderTextColor="#666" />
                    <TextInput style={styles.input} placeholder="Bike Location" value={location} onChangeText={setLocation} placeholderTextColor="#666" />
                    <TextInput style={styles.input} placeholder="Rental fee per Day" value={rental} onChangeText={setRental} keyboardType="numeric" placeholderTextColor="#666" />

                    <TouchableOpacity style={styles.imagePicker} onPress={handleImagePickAndUpload}>
                        {uploading ? (
                            <ActivityIndicator size="large" color="#007bff" />
                        ) : image ? (
                            <Image source={{ uri: image }} style={styles.imagePreview} />
                        ) : (
                            <Text style={styles.imagePickerText}>Tap to select and upload an image</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={handleSaveBike} disabled={loading}>
                        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Save Bike</Text>}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f9fa" },
    scrollContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    formContainer: { width: "100%", backgroundColor: "white", borderRadius: 10, padding: 20, elevation: 5 },
    title: { fontSize: 26, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#343a40" },
    input: { backgroundColor: "#f1f3f5", borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16, color: "#333" },
    imagePicker: { backgroundColor: "#e9ecef", borderRadius: 8, padding: 15, alignItems: "center", justifyContent: "center", marginTop: 10 },
    imagePickerText: { color: "#007bff", fontSize: 16 },
    imagePreview: { width: 200, height: 200, borderRadius: 10, marginTop: 10 },
    button: { backgroundColor: "#007bff", paddingVertical: 14, borderRadius: 8, alignItems: "center", marginTop: 20 },
    buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});

export default AddBikeScreen;
