import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import SeatMapScreen from '../screens/SeatMapScreen';
import BookingScreen from '../screens/BookingScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Smart Library' }} />
      <Stack.Screen name="SeatMap" component={SeatMapScreen} options={{ title: 'Select a Seat' }} />
      <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Confirm Booking' }} />
    </Stack.Navigator>
  );
}
