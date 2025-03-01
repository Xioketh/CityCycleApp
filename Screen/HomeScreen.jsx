import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
    const [userRole, setUserRole] = useState('');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const getLoginUserInfo = async () => {
            const role = await AsyncStorage.getItem('role');
            const user_name = await AsyncStorage.getItem('userName');
            if (role) {
                setUserRole(role);
                setUserName(user_name);
            }
        };
        getLoginUserInfo();
    }, []);

    return (
        <ImageBackground style={styles.background}>
            <View style={styles.overlay}>
                <Text style={styles.title}>Welcome, {userName || 'User'}!</Text>
                <Text style={styles.subtitle}>Explore CityCycle</Text>

                {userRole === 'admin' && (
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Add-Bike')}>
                        <Text style={styles.buttonText}>+ Add Bike</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Reserve')}>
                    <Text style={styles.buttonText}>{userRole === 'user' ? 'Reserve a Bike' : 'Bikes List'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RentalHistory')}>
                    <Text style={styles.buttonText}>Rental History</Text>
                </TouchableOpacity>

                {userRole === 'user' && (
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PersonalInfo')}>
                        <Text style={styles.buttonText}>Personal Information</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.logOutButton} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.buttonText}>Log Out</Text>
                </TouchableOpacity>

                {/*<TouchableOpacity style={styles.logOutButton} onPress={() => navigation.navigate('image')}>*/}
                {/*    <Text style={styles.buttonText}>im</Text>*/}
                {/*</TouchableOpacity>*/}
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#d0d0d0',
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 10,
        marginBottom: 15,
        width: '90%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    logOutButton: {
        backgroundColor: '#d9534f',
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 10,
        marginBottom: 15,
        width: '90%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default HomeScreen;
