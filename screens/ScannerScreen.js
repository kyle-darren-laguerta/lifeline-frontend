import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, StatusBar } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LaserLine } from '../animation/LaserLine';
import Header from '../components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [instructionText, setInstructionText] = useState("Scan the student QR Code");

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  const separateUrlAndId = (urlString) => {
      try {
          const url = new URL(urlString);
          
          return {
              link: `${url.origin}${url.pathname}`,
              id: url.searchParams.get('schoolId'),
              isValid: true
          };
      } catch (error) {
          // This runs if the input is not a valid URL
          return {
              link: null,
              id: null,
              isValid: false,
              error: "Invalid URL provided"
          };
      }
  };

  return (
  <View style={styles.container}>
    <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#ffffff" // Android background color
      />
    <CameraView
      style={StyleSheet.absoluteFillObject}
      onBarcodeScanned={({ data }) => {
        // if (/[^a-zA-Z0-9-]/.test(data)) {
        //   setInstructionText("This is not a valid ID");
        //   setTimeout(() => {
        //     setInstructionText("Scan the student QR Code");
        //   }, 2000);
        //   return;
        // }
        const { link, id } = separateUrlAndId(data);

        if (link === null || id === null || id.length !== 12) {
            setInstructionText("This is not a valid ID");
            setTimeout(() => {
              setInstructionText("Scan the student QR Code");
            }, 2000);
            return;
        }

        navigation.navigate("FormScreen", { studentID: id });
      }}
      barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
    />

    <View style={styles.overlay}>
      {/* 1. Add the Header here with a specific style */}
      <SafeAreaView style={styles.headerWrapper}>
        <Header />
      </SafeAreaView>

      {/* 2. The rest of your layout remains exactly the same */}
      <View style={styles.unfocusedContainer}></View>
      
      <View style={styles.middleContainer}>
        <View style={styles.unfocusedContainer}></View>
        <View style={styles.focusedContainer}>
             <View style={styles.cornerTopLeft} />
             <View style={styles.cornerTopRight} />
             <View style={styles.cornerBottomLeft} />
             <View style={styles.cornerBottomRight} />
             <LaserLine />
        </View>
        <View style={styles.unfocusedContainer}></View>
      </View>

      <View style={styles.unfocusedContainer}>
          <Text style={styles.instructionText}>{instructionText}</Text>
      </View>
    </View>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10, // Ensures it stays on top of the dimmed background
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', // Dims the area outside the scanner
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleContainer: {
    flexDirection: 'row',
    height: 250, // Height of the scanning box
  },
  focusedContainer: {
    width: 250, // Width of the scanning box
    backgroundColor: 'transparent',
  },
  // Corners Styling
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#86112e',
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#86112e',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#86112e',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#86112e',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});