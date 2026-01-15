import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import ScannerScreen from './screens/ScannerScreen';

export default function App() {
  return (
    <ScannerScreen />
  );
}