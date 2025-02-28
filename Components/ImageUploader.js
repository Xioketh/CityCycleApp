// ImageUploader.js
import React, { useState } from 'react';
import { Button, Image, View, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { storage } from '../Config/firebaseConfig';
import { storage } from "../Config/firebaseConfig";

const ImageUploader = () => {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const uploadImage = async () => {
        if (!image) {
            Alert.alert('No image selected');
            return;
        }

        setUploading(true);

        try {
            const response = await fetch(image);
            const blob = await response.blob();
            const storageRef = ref(storage, `images/${Date.now()}`);
            const snapshot = await uploadBytes(storageRef, blob);
            const url = await getDownloadURL(snapshot.ref);

            console.log('URL: '+url)

            // Alert.alert('Upload successful', `Image URL: ${url}`);
        } catch (error) {
            console.error(error);
            setUploading(false);
            // Alert.alert('Upload failed', error.message);
        } finally {
            setUploading(false);
        }

    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button title="Pick an image from camera roll" onPress={pickImage} />
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginTop: 20 }} />}
            <Button title="Upload Image" onPress={uploadImage} disabled={uploading} />
        </View>
    );
};

export default ImageUploader;
