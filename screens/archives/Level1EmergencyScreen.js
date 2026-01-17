import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Level3EmergencyScreen = () => {
  const insets = useSafeAreaInsets(); // This gets the "danger zone" height

  return (
    <View style={styles.container}>
      {/* ... rest of your screen ... */}

      <TouchableOpacity 
        style={[
          styles.broadcastButton, 
          { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 } 
          // If there's a notch/bar, use that height. Otherwise, use standard padding.
        ]}
      >
        <Text style={styles.broadcastText}>BROADCAST TO ALL STAFF</Text>
      </TouchableOpacity>
    </View>
  );
};

const Level1EmergencyScreen = () => {
  const [reason, setReason] = useState('');
  const [disposition, setDisposition] = useState('Back to Class');
  const insets = useSafeAreaInsets();

  const routineReasons = [
    { id: '1', label: 'Daily Medication', icon: 'pill' },
    { id: '2', label: 'Minor Scrape', icon: 'band-aid' },
    { id: '3', label: 'Headache', icon: 'emoticon-confused' },
    { id: '4', label: 'Rest / Fatigue', icon: 'bed' },
    { id: '5', label: 'Temperature Check', icon: 'thermometer' },
    { id: '6', label: 'Ice Pack', icon: 'snowflake' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Level 1: Routine Visit</Text>
        <Text style={styles.headerSubtitle}>Standard Clinic Documentation</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        

        {/* Reason for Visit Grid */}
        <Text style={styles.label}>REASON FOR VISIT</Text>
        <View style={styles.grid}>
          {routineReasons.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.gridItem, reason === item.label && styles.selectedItem]}
              onPress={() => setReason(item.label)}
            >
              <MaterialCommunityIcons 
                name={item.icon} 
                size={24} 
                color={reason === item.label ? '#ffea25' : '#666'} 
              />
              <Text style={[styles.gridText, reason === item.label && styles.selectedText]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Treatment Administered */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>TREATMENT / ACTION TAKEN</Text>
          <TextInput
            style={styles.textArea}
            placeholder="e.g. Cleaned wound, provided 15 min rest..."
            multiline
          />
        </View>

        {/* Disposition (Where are they going?) */}
        <Text style={styles.label}>DISPOSITION</Text>
        <View style={styles.dispositionContainer}>
          {['Back to Class', 'Sent Home', 'Waiting for Pickup'].map((option) => (
            <TouchableOpacity 
              key={option} 
              style={styles.radioRow} 
              onPress={() => setDisposition(option)}
            >
              <MaterialCommunityIcons 
                name={disposition === option ? 'radiobox-marked' : 'radiobox-blank'} 
                size={22} 
                color="#ffea25" 
              />
              <Text style={styles.radioText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={[styles.saveButtonText]}>SAVE LOG ENTRY</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F4' },
  header: { backgroundColor: '#d7d759', padding: 30, paddingTop: 50 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: 'white' },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  content: { padding: 20 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#555', marginBottom: 8, letterSpacing: 0.5 },
  inputGroup: { marginBottom: 20 },
  searchBar: { 
    flexDirection: 'row', 
    backgroundColor: 'white', 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  searchInput: { marginLeft: 10, flex: 1, fontSize: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 10 },
  gridItem: { 
    width: '48%', 
    backgroundColor: 'white', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  selectedItem: { borderColor: '#aaaf4c', backgroundColor: '#f5f5e8' },
  gridText: { marginTop: 5, fontSize: 12, color: '#666', textAlign: 'center' },
  selectedText: { color: '#ffea25', fontWeight: 'bold' },
  textArea: { 
    backgroundColor: 'white', 
    borderRadius: 8, 
    padding: 12, 
    height: 80, 
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  dispositionContainer: { backgroundColor: 'white', borderRadius: 8, padding: 10, marginBottom: 30 },
  radioRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 5 },
  radioText: { marginLeft: 10, fontSize: 16, color: '#333' },
  saveButton: { backgroundColor: '#ffea25', padding: 20, alignItems: 'center' },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

export default Level1EmergencyScreen;