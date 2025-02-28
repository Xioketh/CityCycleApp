import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
    apiKey: "AIzaSyAR3QPn6SEluin3xDdQ6fUhhEKGq2u1KHs",
    authDomain: "citycycleapp-87682.firebaseapp.com",
    projectId: "citycycleapp-87682",
    storageBucket: "citycycleapp-87682.firebasestorage.app",
    messagingSenderId: "868539252958",
    appId: "1:868539252958:web:5056b18ef0b5813a86024f",
    measurementId: "G-JJYDMMLG1L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);
const storage = getStorage(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, storage };
