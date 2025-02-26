import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './Screen/LoginScreen';  // Import LoginScreen
import SignupScreen from './Screen/SignupScreen'; // Import SignupScreen
import MapScreen from './Screen/MapScreen'; // Import MapScreen
import HomeScreen from "./Screen/HomeScreen";
import ReserveBikeScreen from "./Screen/ReserveBikeScreen";
import RentalHistoryScreen from "./Screen/RentalHistoryScreen";
import PersonalInfoScreen from "./Screen/PersonalInfoScreen"; // Import ReserveBike

const Stack = createStackNavigator();

const App = () => {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="RentalHistory">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Map" component={MapScreen} />
          <Stack.Screen name="Reserve" component={ReserveBikeScreen} />
          <Stack.Screen name="RentalHistory" component={RentalHistoryScreen} />
          <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default App;
