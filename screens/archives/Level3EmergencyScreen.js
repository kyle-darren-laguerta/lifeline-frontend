import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Level3EmergencyScreen = () => {
  const [seconds, setSeconds] = useState(0);

  // Start a timer automatically when the screen opens
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleCriticalAction = (type) => {
    Alert.alert("Emergency Broadcast Sent", `${type} alert sent to Campus Security and EMS.`);
  };

  return (
    <View style={styles.container}>
      {/* Header with Active Timer */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>TIME SINCE TRIGGER</Text>
        <Text style={styles.timerText}>{formatTime(seconds)}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Call 911 Direct Action */}
        <TouchableOpacity 
          style={styles.emergencyButton} 
          onPress={() => Alert.alert("Dialing 911...")}
        >
          <MaterialCommunityIcons name="phone-in-talk" size={32} color="white" />
          <Text style={styles.emergencyButtonText}>CALL 911 NOW</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>SELECT CONDITION</Text>
        
        {/* Grid of Critical Conditions */}
        <View style={styles.grid}>
          {[
            { label: 'Unconscious', icon: 'account-off' },
            { label: 'Severe Bleed', icon: 'water' },
            { label: 'Seizure', icon: 'lightning-bolt' },
            { label: 'Anaphylaxis', icon: 'needle' },
          ].map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.gridItem} 
              onPress={() => handleCriticalAction(item.label)}
            >
              <MaterialCommunityIcons name={item.icon} size={40} color="#7a0000" />
              <Text style={styles.gridLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Life-Saving Equipment Locator */}
        <View style={styles.equipmentCard}>
          <MaterialCommunityIcons name="heart-flash" size={30} color="#D32F2F" />
          <View style={styles.equipmentTextContainer}>
            <Text style={styles.equipmentTitle}>Enter Location/Landmark</Text>
            <TextInput style={{borderBlockColor: "gray", borderBottomWidth: 1, width: '100%' }}/>
          </View>
        </View>

        {/* Vital Student Info Snippet */}
        <View style={styles.studentInfoCard}>
          <Text style={styles.infoTitle}>STUDENT: JOHN DOE (ID: 4492)</Text>
          <Text style={styles.alertText}>⚠️ ALLERGY: PEANUTS / LATEX</Text>
          <Text style={styles.alertText}>⚠️ CONDITION: ASTHMA</Text>
        </View>

      </ScrollView>

      {/* Persistent Footer Trigger */}
      <TouchableOpacity style={styles.broadcastButton} onPress={() => handleCriticalAction("General Medical")}>
        <Text style={styles.broadcastText}>BROADCAST TO ALL STAFF</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { backgroundColor: '#7a0000', padding: 40, alignItems: 'center' },
  headerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 'bold' },
  timerText: { color: 'white', fontSize: 48, fontWeight: '900' },
  content: { padding: 20 },
  emergencyButton: {
    flexDirection: 'row',
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  emergencyButtonText: { color: 'white', fontSize: 22, fontWeight: 'bold', marginLeft: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#666', marginBottom: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: {
    width: '48%',
    backgroundColor: '#FDECEA',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#EF9A9A',
  },
  gridLabel: { marginTop: 10, fontWeight: 'bold', color: '#B71C1C' },
  equipmentCard: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: '#D32F2F',
    marginTop: 10,
  },
  equipmentTextContainer: { marginLeft: 15, width: "80%" },
  equipmentTitle: { fontSize: 12, color: '#D32F2F', fontWeight: 'bold' },
  equipmentLocation: { fontSize: 16, fontWeight: 'bold' },
  studentInfoCard: { marginTop: 20, padding: 15, backgroundColor: '#EEE', borderRadius: 12 },
  infoTitle: { fontWeight: 'bold', marginBottom: 5 },
  alertText: { color: '#D32F2F', fontWeight: 'bold', fontSize: 15 },
  broadcastButton: { backgroundColor: '#7a0000', padding: 20, alignItems: 'center' },
  broadcastText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});

export default Level3EmergencyScreen;