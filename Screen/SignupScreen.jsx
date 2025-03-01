import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Config/firebaseConfig";
import {addUserToFirestore} from "../Services/userService";
import Toast from 'react-native-toast-message';


const SignupScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(false);


    const handleRegister = async () => {
        // Basic validation checks
        if (!name.trim()) {
            Toast.show({ type: "error", text1: "Validation Error", text2: "Name is required!", position: "top" });
            return;
        }

        if (!phone.trim() || !/^\d{10}$/.test(phone)) {
            Toast.show({ type: "error", text1: "Validation Error", text2: "Phone number must be exactly 10 digits!", position: "top" });
            return;
        }

        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            Toast.show({ type: "error", text1: "Validation Error", text2: "Enter a valid email address!", position: "top" });
            return;
        }

        if (!password.trim() || password.length < 6) {
            Toast.show({ type: "error", text1: "Validation Error", text2: "Password must be at least 6 characters long!", position: "top" });
            return;
        }

        try {
            setLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await addUserToFirestore(user.uid, email, name, phone, 'user');

            Toast.show({
                type: "success",
                text1: "Registration Successful!",
                text2: "Please Login to continue",
                position: "top",
            });
            navigation.navigate("Login");
        } catch (error) {
            Toast.show({ type: "error", text1: "Registration Failed!", text2: error.message, position: "bottom" });
        } finally {
            setLoading(false);
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
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Phone"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                    {loading ? <ActivityIndicator color="white" /> :<Text style={styles.buttonText}>Register</Text>}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => navigation.navigate("Login")}
                >
                    <Text style={styles.loginButtonText}>Already have an account? Login</Text>
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
export default SignupScreen;
