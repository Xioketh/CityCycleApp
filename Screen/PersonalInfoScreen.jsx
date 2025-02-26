import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PersonalInfoScreen = ({ navigation }) => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUserName = await AsyncStorage.getItem('userName');
                const storedEmail = await AsyncStorage.getItem('userEmail');
                const storedPhone = await AsyncStorage.getItem('userPhone');
                const storedUserId = await AsyncStorage.getItem('userId');

                if (storedUserName) setUserName(storedUserName);
                if (storedEmail) setEmail(storedEmail);
                if (storedPhone) setPhone(storedPhone);
                if (storedUserId) setUserId(storedUserId);
            } catch (error) {
                Alert.alert('Error', 'Failed to load user data.');
            }
        };

        fetchUserData();
    }, []);

    const handleUpdate = async () => {
        try {
            await AsyncStorage.setItem('userName', userName);
            await AsyncStorage.setItem('userEmail', email);
            await AsyncStorage.setItem('userPhone', phone);
            Alert.alert('Success', 'Your details have been updated.');
        } catch (error) {
            Alert.alert('Error', 'Failed to update user details.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Personal Information</Text>

            <Text style={styles.label}>User ID:</Text>
            <Text style={styles.value}>{userId || 'Not Available'}</Text>

            <Text style={styles.label}>Name:</Text>
            <TextInput style={styles.input} value={userName} onChangeText={setUserName} placeholder="Enter Name" />

            <Text style={styles.label}>Email:</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Enter Email" keyboardType="email-address" />

            <Text style={styles.label}>Phone:</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Enter Phone" keyboardType="phone-pad" />

            <Button title="Update Info" onPress={handleUpdate} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    value: {
        fontSize: 16,
        marginBottom: 10,
        color: '#333',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingLeft: 10,
        backgroundColor: '#fff',
    },
});

export default PersonalInfoScreen;
