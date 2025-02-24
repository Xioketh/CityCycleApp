import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const db = getFirestore();

const RentalHistoryScreen = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            const querySnapshot = await getDocs(collection(db, "rentalHistory"));
            setHistory(querySnapshot.docs.map(doc => doc.data()));
        };

        fetchHistory();
    }, []);

    return (
        <View>
            <Text>Rental History:</Text>
            {history.map((item, index) => (
                <Text key={index}>{item.bike} - {item.date}</Text>
            ))}
        </View>
    );
};

export default RentalHistoryScreen;
