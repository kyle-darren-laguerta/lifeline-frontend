import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useRef } from "react";
import * as Haptics from 'expo-haptics';
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
import EmergencyBorder from "../components/EmergencyBorder";

export default function FormScreen({ navigation, route }) {
    const { studentID } = route.params;
    const [currentAlarmId, setCurrentAlarmId] = useState("");
    const [isAlarming, setIsAlarming] = useState(false);
    const [isEmergencyActive, setIsEmergenycActive] = useState(false);
    const intervalRef = useRef();

    // Contact Data (Can be moved to a separate config file later)
    const emergencyContacts = [
        { department: "National Emergency", phone: "911", icon: "🛡️" },
        { department: "CDRRMO", phone: "0956-635-2627", icon: "🛡️" },
        { department: "PNP", phone: "0998-598-5928", icon: "🛡️" },
        { department: "JBDAPH ER Tuburan", phone: "0945-296-2595", icon: "🏥" },
        { department: "ZMIH-ER", phone: "0945-296-2595", icon: "🏥" },
        { department: "BRHMC", phone: "0977-766-8533", icon: "🏥" },
        
    ];

    const backend_url = process.env.EXPO_PUBLIC_BACKEND_URL || "http://192.168.1.63:3000";

    useEffect(() => {
        async function createOrGetAlarm() {
            try {
                const response = await fetch(`${backend_url}/alarm/${studentID}`, {
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

    useEffect(() => {
        const backAction = () => {
            Alert.alert("Hold on!", "Are you sure you want to exit? The emergency response is active.", [
                { text: "Cancel", style: "cancel" },
                { text: "YES, EXIT", onPress: () => navigation.goBack() }
            ]);
            return true;
        };
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, []);

    const handleCall = async (phoneNumber) => {
        const cleanNumber = phoneNumber.replace(/[^0-9+]/g, '');
        const url = `tel:${cleanNumber}`;

        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert("Unable to Call", "This device cannot make phone calls.");
            }
        } catch (error) {
            Alert.alert("Error", "An unexpected error occurred.");
        }
    };

    const emergency = async () => {
        try {
            const response = await fetch(`${backend_url}/alarm/${studentID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emergency: true, status: 'ongoing' })
            });
            const data = await response.json();
            startAlarm();
            setIsEmergenycActive(true);
            if (data.success) Alert.alert("Success", "Emergency services notified.");
            setTimeout(() => {
                stopAlarm();
            }, 3000);

        } catch (err) {
            console.log("Error: " + err.message);
        }
    };

    const falseAlarm = async () => {
        try {
            const response = await fetch(`${backend_url}/alarm/${currentAlarmId}/false`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ authority: 'STUDENT' })
            });
            const data = await response.json();
            if (data.success) {
                Alert.alert("Resolved", "Marked as false alarm.");
                navigation.goBack();
            }
        } catch (err) {
            console.log("Error: " + err.message);
        }
    };

    const startAlarm = () => {
        setIsAlarming(true);

        intervalRef.current = setInterval(() => {
            // Use Haptics for a stronger feel or Vibration.vibrate()
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }, 100); 
  };

  const stopAlarm = () => {
        setIsAlarming(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
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
                        color="#f61e1e" 
                        imgPath={require("../assets/images/emergency-icon.png")} 
                        headerText={"Notify as Emergency"} 
                        onPress={emergency}
                    />
                    <View style={{ height: 12 }} />
                    <EmergencyLevelButton 
                        color="#7e0000" 
                        imgPath={require("../assets/images/false-alarm-icon.png")} 
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
            <EmergencyBorder active={isEmergencyActive}/>
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