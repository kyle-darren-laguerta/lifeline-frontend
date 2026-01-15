import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Button, Animated } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

// 1. Define the Laser Component
export function LaserLine() {
  const moveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnim, {
          toValue: 250, // This should match your frame height
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [moveAnim]);

  return (
    <Animated.View
      style={[
        styles.laser,
        { transform: [{ translateY: moveAnim }] },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  unfocusedContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  middleRow: { flexDirection: 'row', height: 250 },
  focusedContainer: { width: 250, backgroundColor: 'transparent', position: 'relative' },
  
  // Laser Style
  laser: {
    width: '100%',
    height: 3,
    backgroundColor: '#00FF00',
    shadowColor: '#00FF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10, // Shadow for Android
  },

  // Corner Styles
  cornerTopLeft: { position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderTopWidth: 4, borderLeftWidth: 4, borderColor: '#00FF00' },
  cornerTopRight: { position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderTopWidth: 4, borderRightWidth: 4, borderColor: '#00FF00' },
  cornerBottomLeft: { position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: '#00FF00' },
  cornerBottomRight: { position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderBottomWidth: 4, borderRightWidth: 4, borderColor: '#00FF00' },
  
  instructionText: { color: 'white', fontSize: 16, marginBottom: 20, fontWeight: '600' },
});