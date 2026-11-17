import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import Phase1Screen from '../screens/Phase1Screen';
import Phase2Screen from '../screens/Phase2Screen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ orientation: 'portrait' }} />
        <Stack.Screen name="Phase1" component={Phase1Screen} options={{ orientation: 'landscape' }} />
        <Stack.Screen name="Phase2" component={Phase2Screen} options={{ orientation: 'portrait' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
