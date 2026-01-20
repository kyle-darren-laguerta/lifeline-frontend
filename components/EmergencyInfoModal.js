import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // Built-in with Expo

const EmergencyInfoModal = ({ visible, onClose }) => {
  const emergencyLevels = [
    {
      type: "TYPE 1: Code Green",
      subtitle: "Minor / Resolvable Emergency",
      color: "#2ecc71",
      items: [
        "Minor cuts or bruises",
        "Mild headache or stomach ache",
        "Student feels dizzy but recovers",
        "Minor conflicts between students"
      ]
    },
    {
      type: "TYPE 2: Code Yellow",
      subtitle: "Moderate / Intense Emergency",
      color: "#f1c40f",
      items: [
        "Student faints or has a seizure",
        "Severe asthma attack",
        "Serious injury (deep cuts, fractures)",
        "Panic or anxiety attacks"
      ]
    },
    {
      type: "TYPE 3: Code Red",
      subtitle: "Critical / Deadly Emergency",
      color: "#e74c3c",
      items: [
        "Natural disasters endangering lives (flood, typhoon, etc.)",
        "Armed intruders",
        "Severe allergic reactions",
        "Unconsciousness / Not breathing"
      ]
    }
  ];

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          
          {/* Header with Question Mark Icon */}
          <View style={styles.header}>
            <AntDesign name="questioncircleo" size={24} color="#555" />
            <Text style={styles.headerTitle}>Emergency Protocols</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {emergencyLevels.map((level, index) => (
              <View key={index} style={styles.section}>
                <View style={[styles.badge, { backgroundColor: level.color }]}>
                  <Text style={styles.badgeText}>{level.type}</Text>
                </View>
                <Text style={styles.subtitle}>{level.subtitle}</Text>
                
                {level.items.map((item, i) => (
                  <View key={i} style={styles.listItem}>
                    <View style={[styles.bullet, { backgroundColor: level.color }]} />
                    <Text style={styles.itemText}>{item}</Text>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Understood</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  section: {
    marginBottom: 25,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingLeft: 5,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 10,
  },
  itemText: {
    fontSize: 15,
    color: '#444',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default EmergencyInfoModal;