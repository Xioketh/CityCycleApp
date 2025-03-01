import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image, ScrollView} from 'react-native';
import {getFirestore, collection, getDocs, query, where, doc, getDoc, updateDoc} from 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';

const db = getFirestore();

const RentalHistoryScreen = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rentalCompleting, setRentalCompleting] = useState(false);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        fetchHistoryWithBikeDetails();
    }, []);

    const fetchHistoryWithBikeDetails = async () => {
        try {
            const role = await AsyncStorage.getItem('role');
            setUserRole(role);
            let q;

            if (role === 'user') {
                const userId = await AsyncStorage.getItem('userId');
                q = query(collection(db, "rental_history"), where("user_id", "==", userId));
            } else {
                q = query(collection(db, "rental_history"));
            }

            const querySnapshot = await getDocs(q);

            const rentalHistory = await Promise.all(
                querySnapshot.docs.map(async (docSnapshot) => {
                    const rentalData = docSnapshot.data();

                    // console.log(rentalData)
                    const bikeRef = doc(db, "bikes", rentalData.bike_id);
                    const userRef = doc(db, "users", rentalData.user_id);

                    const [bikeSnapshot, userSnapshot] = await Promise.all([
                        getDoc(bikeRef),
                        getDoc(userRef),
                    ]);

                    return {
                        id: docSnapshot.id,
                        ...rentalData,
                        bike: bikeSnapshot.exists() ? bikeSnapshot.data() : null,
                        user: userSnapshot.exists() ? userSnapshot.data() : null,
                    };
                })
            );

            setHistory(rentalHistory);
        } catch (error) {
            console.error("Error fetching rental history:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateRentalStatus = async (item) => {

        try {
            setRentalCompleting(true);
            const rentalFeePerDay = item.bike?.rental;
            const rentFrom = new Date(item.from);
            const rentTo = new Date();

            const timeDiff = rentTo - rentFrom;
            const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            const totalRentalFee = dayDiff * rentalFeePerDay;

            const rentalHistoryRef = doc(db, "rental_history", item.id);
            const bikeRef = doc(db, "bikes", item.bike_id);

            await updateDoc(rentalHistoryRef, {
                status: 1,
                // status: 0,
                fees: totalRentalFee,
                to: new Date().toISOString().split("T").join(" ").slice(0, 19)
            });

            await updateDoc(bikeRef, {
                status: true,
                reserved_user_id: null
            });

            Toast.show({
                type: "success",
                text1: "Rental Completed!",
                text2: "Bike rental has been successfully Completed.",
                position: "top",
            });
            fetchHistoryWithBikeDetails();
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Failed to complete rental. Please try again.",
                position: "top",
            });
        } finally {
            setRentalCompleting(false);
        }

    };

    if (loading) {
        return <ActivityIndicator size="large" color="#007bff" style={styles.loading}/>;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Rental History</Text>
            {history.length > 0 ? (
                history.map((item) => (
                    <View key={item.id} style={styles.card}>
                        <Image source={{uri: item.bike?.image}} style={styles.bikeImage}/>
                        <Text style={styles.bikeBrand}>{item.bike?.brand_name || "Unknown Bike"}</Text>
                        <Text style={styles.infoText}>Location: {item.bike?.location || "Unknown"}</Text>
                        <Text style={styles.infoText}>Rental Date: {new Date(item.from).toLocaleDateString()}</Text>

                        {userRole === 'admin' && (
                            // user info
                            <View style={styles.userInfoContainer}>
                                <Text style={styles.userInfoTitle}>User Information:</Text>
                                <View style={styles.userInfoRow}>
                                    <Text style={styles.userInfoLabel}>Email:</Text>
                                    <Text style={styles.userInfoValue}>{item.user?.email || "Unknown"}</Text>
                                </View>
                                <View style={styles.userInfoRow}>
                                    <Text style={styles.userInfoLabel}>Name:</Text>
                                    <Text style={styles.userInfoValue}>{item.user?.name || "Unknown"}</Text>
                                </View>
                                <View style={styles.userInfoRow}>
                                    <Text style={styles.userInfoLabel}>Phone:</Text>
                                    <Text style={styles.userInfoValue}>{item.user?.phone || "Unknown"}</Text>
                                </View>
                            </View>
                        )}

                        {item.status === 1 ? (
                            <View>
                                <Text style={styles.infoText}>Completed
                                    On: {new Date(item.to).toLocaleDateString()}</Text>
                                <Text style={styles.infoText}>Status: <Text
                                    style={styles.completedText}>Completed</Text></Text>
                                <Text style={styles.infoText}>Total Rental Fee: Rs.{item.fees}</Text>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.button} onPress={() => updateRentalStatus(item)}
                                              disabled={rentalCompleting}>
                                <Text style={styles.buttonText}>Complete Rental</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))
            ) : (
                <Text style={styles.noHistoryText}>No rental history found.</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#e0f7fa',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        color: '#007bff',
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    bikeImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    bikeBrand: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    infoText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 3,
    },
    completedText: {
        fontWeight: 'bold',
        color: 'green',
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    noHistoryText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#555',
        marginTop: 20,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
    },
    userInfoContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    userInfoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    userInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 3,
    },
    userInfoLabel: {
        fontWeight: 'bold',
        color: '#555',
    },
    userInfoValue: {
        color: '#555',
    },
});

export default RentalHistoryScreen;
