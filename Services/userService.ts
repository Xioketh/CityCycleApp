import { db } from "../Config/firebaseConfig";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

const usersCollection = collection(db, "users");

// Function to add a user to Firestore
export const addUserToFirestore = async (userId: string, email: string, name: string, phone: string, role:string) => {
    try {
        await setDoc(doc(usersCollection, userId), {
            userId,
            email,
            name,
            phone,
            role
        });
    } catch (error) {
        console.error("Error adding user: ", error);
        throw error;
    }
};

// Function to get user details from Firestore
export const getUserFromFirestore = async (userId: string) => {
    try {
        const userDoc = await getDoc(doc(usersCollection, userId));
        if (userDoc.exists()) {
            return userDoc.data();
        } else {
            console.log("User not found!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user: ", error);
        throw error;
    }
};
