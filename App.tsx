import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './Screen/LoginScreen';
import SignupScreen from './Screen/SignupScreen';
import MapScreen from './Screen/MapScreen';
import HomeScreen from "./Screen/HomeScreen";
import ReserveBikeScreen from "./Screen/ReserveBikeScreen";
import RentalHistoryScreen from "./Screen/RentalHistoryScreen";
import PersonalInfoScreen from "./Screen/PersonalInfoScreen";
import AddBikeScreen from "./Screen/AddBikeScreen";
import { UserProvider } from "./Shared/UserContext";
// import ImageUploader from "./Screen/ImageUploader";
import Toast from 'react-native-toast-message';
import { toastConfig } from "./Config/toastConfig";

const Stack = createStackNavigator();

const App = () => {
    return (
        <UserProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen name="Login" component={LoginScreen}/>
                    <Stack.Screen name="Home" component={HomeScreen}/>
                    <Stack.Screen name="Signup" component={SignupScreen}/>
                    <Stack.Screen name="Map" component={MapScreen}/>
                    <Stack.Screen name="Reserve" component={ReserveBikeScreen}/>
                    <Stack.Screen name="RentalHistory" component={RentalHistoryScreen}/>
                    <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen}/>
                    <Stack.Screen name="Add-Bike" component={AddBikeScreen}/>
                    {/*<Stack.Screen name="image" component={ImageUploader}/>*/}
                </Stack.Navigator>
            </NavigationContainer>
            <Toast config={toastConfig} />
        </UserProvider>
    );
};

export default App;
