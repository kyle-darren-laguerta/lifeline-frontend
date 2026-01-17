import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import ScannerScreen from './screens/ScannerScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import FormScreen from './screens/FormScreen';
import Level3EmergencyScreen from './screens/archives/Level3EmergencyScreen';
import Level2EmergencyScreen from './screens/archives/Level2EmergencyScreen';
import Level1EmergencyScreen from './screens/archives/Level1EmergencyScreen';

export default function App() {
  const Stack = createNativeStackNavigator();


  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="ScannerScreen" component={ScannerScreen} options={{ headerShown: false, }}/>
        <Stack.Screen name="FormScreen" component={FormScreen} options={{ headerShown: false, }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}