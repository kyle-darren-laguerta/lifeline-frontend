import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const EmergencyBorder = ({ active }) => {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (active) {
      // Creates a "pulsing" breathing effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(0);
    }
  }, [active]);

  if (!active) return null;

  return (
    <Animated.View 
      style={[styles.fullScreen, { opacity: pulseAnim }]} 
      pointerEvents="none" // Allows user to click buttons "through" the glow
    >
      {/* Top Feathered Edge */}
      <LinearGradient
        colors={['rgba(231, 76, 60, 0.8)', 'transparent']}
        style={[styles.edge, { height: 100, top: 0, width: '100%' }]}
      />
      {/* Bottom Feathered Edge */}
      <LinearGradient
        colors={['transparent', 'rgba(231, 76, 60, 0.8)']}
        style={[styles.edge, { height: 100, bottom: 0, width: '100%' }]}
      />
      {/* Left Feathered Edge - Flows Left to Right */}
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={['rgba(231, 76, 60, 0.9)', 'rgba(231, 76, 60, 0.3)', 'transparent']}
        style={[styles.edge, { width: 100, left: 0, height: '100%' }]}
      />

      {/* Right Feathered Edge - Flows Right to Left */}
      <LinearGradient
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        colors={['rgba(231, 76, 60, 0.9)', 'rgba(231, 76, 60, 0.3)', 'transparent']}
        style={[styles.edge, { width: 100, right: 0, height: '100%' }]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999, // Ensures it stays on top of everything
  },
  edge: {
    position: 'absolute',
  },
});

export default EmergencyBorder;