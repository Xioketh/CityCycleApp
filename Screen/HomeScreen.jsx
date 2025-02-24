import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';

const HomeScreen = ({ navigation }) => {

    const handleReserveBike = async () => {
        try {
            console.log('login clicked!!')
            // await signInWithEmailAndPassword(auth, email, password);
            navigation.navigate('Reserve'); // Navigate to the Map screen after login
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <View>
            <Text>Home</Text>
            <Button title="Reserve Bikes" onPress={handleReserveBike} />
            <Button title="Reserve History" onPress={() => navigation.navigate('RentalHistory')}/>
        </View>
    );
};

export default HomeScreen;
