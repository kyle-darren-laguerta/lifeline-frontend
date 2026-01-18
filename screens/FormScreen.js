import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { 
    Text, 
    BackHandler, 
    Alert, 
    View, 
    StyleSheet, 
    ScrollView, 
    Linking // Added to allow clicking phone numbers
} from "react-native";
import Dropdown from "../components/Dropdown";
import EmergencyLevelButton from "../components/EmergencyLevelButton";
import Header from "../components/Header";

export default function FormScreen({ navigation, route }) {
    const { studentID } = route.params;
    const [currentAlarmId, setCurrentAlarmId] = useState("");

    // Contact Data (Can be moved to a separate config file later)
    const emergencyContacts = [
        { department: "Campus Security", phone: "555-0199", icon: "🛡️" },
        { department: "Medical Clinic", phone: "555-0122", icon: "🏥" },
        { department: "Local Fire Dept", phone: "911", icon: "🚒" },
    ];

    useEffect(() => {
        async function createOrGetAlarm() {
            try {
                const response = await fetch(`http://192.168.1.63:3000/alarm/${studentID}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        emergency: false,
                        message: { type: '', additionalInfo: '' },
                        status: 'ongoing'
                    })
                });
                const data = await response.json();
                if (data.success) setCurrentAlarmId(data.alarm.id);
            } catch (err) {
                console.log("Failed to send the alarm: " + err.message);
            }
        }
        createOrGetAlarm();
    }, [studentID]);

    const handleCall = (phoneNumber) => {
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const emergency = async () => {
        // ... (existing emergency logic)
        Alert.alert("Emergency Triggered", "Authorities have been notified.");
    };

    const falseAlarm = async () => {
        // ... (existing falseAlarm logic)
        Alert.alert("Resolved", "This incident has been marked as a false alarm.");
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Student Info Section */}
                <View style={styles.infoCard}>
                    <Text style={styles.cardTitle}>Incident Context</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Student ID:</Text>
                        <Text style={styles.value}>{studentID}</Text>
                    </View>
                    <Dropdown 
                        options={["Medical", "Fire", "Security", "Other"]} 
                        placeHolder={"Select emergency type"} 
                    />
                </View>

                {/* Main Actions */}
                <View style={styles.actionSection}>
                    <Text style={styles.sectionTitle}>Immediate Actions</Text>
                    <EmergencyLevelButton 
                        color="#7a0000" 
                        imgPath={require("../assets/images/emergency-icon.png")} 
                        headerText={"Notify as Emergency"} 
                        onPress={emergency}
                    />
                    <View style={{ height: 12 }} />
                    <EmergencyLevelButton 
                        color="#147a00" 
                        imgPath={require("../assets/images/notify-icon.png")} 
                        headerText={"False Alarm"} 
                        onPress={falseAlarm}
                    />
                </View>

                {/* Emergency Departments Directory */}
                <View style={styles.directorySection}>
                    <Text style={styles.sectionTitle}>Emergency Directory</Text>
                    {emergencyContacts.map((contact, index) => (
                        <View key={index} style={styles.contactRow}>
                            <View style={styles.contactInfo}>
                                <Text style={styles.contactIcon}>{contact.icon}</Text>
                                <View>
                                    <Text style={styles.deptName}>{contact.department}</Text>
                                    <Text style={styles.deptPhone}>{contact.phone}</Text>
                                </View>
                            </View>
                            <Text 
                                style={styles.callButton} 
                                onPress={() => handleCall(contact.phone)}
                            >
                                CALL
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f4f4' },
    scrollContent: { padding: 20 },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        elevation: 2,
    },
    cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#444' },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    label: { color: '#666' },
    value: { fontWeight: 'bold' },
    
    actionSection: { marginBottom: 30 },
    sectionTitle: { 
        fontSize: 14, 
        fontWeight: 'bold', 
        color: '#888', 
        marginBottom: 10, 
        textTransform: 'uppercase' 
    },

    directorySection: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    contactRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    contactInfo: { flexDirection: 'row', alignItems: 'center' },
    contactIcon: { fontSize: 24, marginRight: 12 },
    deptName: { fontWeight: '600', color: '#333' },
    deptPhone: { color: '#666', fontSize: 13 },
    callButton: {
        color: '#007AFF',
        fontWeight: 'bold',
        padding: 8,
    }
});