import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider'; // You may need to install this

const Level2UrgentScreen = () => {
  const [painLevel, setPainLevel] = useState(0);
  const [notifyParent, setNotifyParent] = useState(false);
  const [needsEscort, setNeedsEscort] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Level 2: Urgent Care</Text>
        <Text style={styles.headerSubtitle}>Assessment & Triage</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Pain Scale Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PAIN SCALE (0-10)</Text>
          <View style={styles.painDisplay}>
            <Text style={styles.painNumber}>{Math.round(painLevel)}</Text>
            <Text style={styles.painDescription}>
              {painLevel < 3 ? "Mild" : painLevel < 7 ? "Moderate" : "Severe"}
            </Text>
          </View>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={10}
            minimumTrackTintColor="#FFB300"
            maximumTrackTintColor="#D1D1D1"
            thumbTintColor="#FFB300"
            onValueChange={setPainLevel}
          />
        </View>

        {/* Symptoms Grid */}
        <Text style={styles.sectionTitle}>PRIMARY SYMPTOMS</Text>
        <View style={styles.symptomGrid}>
          {['Vomiting', 'High Fever', 'Sprain/Strain', 'Deep Cut', 'Dizziness', 'Allergic Reaction'].map((symptom) => (
            <TouchableOpacity key={symptom} style={styles.chip}>
              <Text style={styles.chipText}>{symptom}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Requirements Section */}
        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleLabel}>Request Escort/Wheelchair</Text>
            <Text style={styles.toggleSub}>Student cannot walk to clinic</Text>
          </View>
          <Switch 
            value={needsEscort} 
            onValueChange={setNeedsEscort}
            trackColor={{ false: "#767577", true: "#FFB300" }}
          />
        </View>

        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleLabel}>Notify Parents Now</Text>
            <Text style={styles.toggleSub}>Send automated SMS update</Text>
          </View>
          <Switch 
            value={notifyParent} 
            onValueChange={setNotifyParent}
            trackColor={{ false: "#767577", true: "#FFB300" }}
          />
        </View>

        {/* Notes Input */}
        <Text style={styles.sectionTitle}>ADDITIONAL NOTES</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Briefly describe the incident..."
          multiline
          numberOfLines={4}
        />

      </ScrollView>

      {/* Action Footer */}
      <TouchableOpacity style={styles.submitButton}>
        <MaterialCommunityIcons name="send" size={20} color="black" />
        <Text style={styles.submitText}>ALERT SCHOOL NURSE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: { backgroundColor: '#FFB300', padding: 30, paddingTop: 50 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'black' },
  headerSubtitle: { fontSize: 16, color: 'rgba(0,0,0,0.6)' },
  content: { padding: 20 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#666', marginBottom: 10, letterSpacing: 1 },
  painDisplay: { alignItems: 'center', marginBottom: 10 },
  painNumber: { fontSize: 40, fontWeight: 'bold', color: '#FFB300' },
  painDescription: { fontSize: 16, fontWeight: '600', color: '#444' },
  symptomGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  chip: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDD',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  chipText: { fontSize: 14, color: '#333' },
  toggleRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
  },
  toggleLabel: { fontSize: 16, fontWeight: 'bold' },
  toggleSub: { fontSize: 12, color: '#888' },
  textArea: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    textAlignVertical: 'top',
    height: 100,
  },
  submitButton: {
    backgroundColor: '#FFB300',
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
});

export default Level2UrgentScreen;