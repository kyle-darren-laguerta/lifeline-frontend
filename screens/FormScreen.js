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
    Linking, // Added to allow clicking phone numbers
    TouchableOpacity,
    ActivityIndicator,
    TextInput
} from "react-native";
import Dropdown from "../components/Dropdown";
import EmergencyLevelButton from "../components/EmergencyLevelButton";
import Header from "../components/Header";
import EmergencyBorder from "../components/EmergencyBorder";
import EmergencyInfoModal from "../components/EmergencyInfoModal";

export default function FormScreen({ navigation, route }) {
    const { studentID } = route.params;
    const [currentAlarmId, setCurrentAlarmId] = useState("");
    const [isAlarming, setIsAlarming] = useState(false);
    const [isEmergencyActive, setIsEmergenycActive] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [incidentMessage, setIncidentMessage] = useState('');
    const [selectedType, setSelectedType] = useState('');
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

    // POST request payload:
    // { emergency: int, message: string, status: string }
    useEffect(() => {
        async function createOrGetAlarm() {
            console.log("--- Request Started ---");
            console.log(`Target URL: ${backend_url}/alarm/${studentID}`);
            console.log("Status: Sending request... (If using Render Free Tier, this may take 1 minute to wake up)");
            
            setIsLoading(true); // Start loading UI
            try {
                const response = await fetch(`${backend_url}/alarm/${studentID}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        emergency: 0,
                        message: 'none',
                        status: 'ongoing'
                    })
                });
                const data = await response.json();
                console.log("--- Request Successful ---");
                console.log("Server Response:", data);
                if (data.success) setCurrentAlarmId(data.alarm.id);
            } catch (err) {
                console.error("--- Request Failed ---");
                console.error("Error Detail:", err.message);
                
                if (err.message === "Network request failed") {
                    Alert.alert("Server Sleeping", "The server is waking up. Please wait 30 seconds and try again.");
                }
            } finally {
                setIsLoading(false);
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
            console.log("Waiting For Response");
            const data = await response.json();
            console.log("Server Responded");
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
                        options={["1", "2", "3"]}
                        placeHolder={"Select emergency type"} 
                        style={{ marginBottom: 1 }} // Increased margin for spacing
                        onSelect={(item) => setSelectedType(item)}
                    />

                    <TouchableOpacity style={{ alignItems: "center", }} onPress={() => setModalVisible(true)}>
                        <Text style={{ textDecorationLine: "underline", color: "#ababab", fontSize: 13, }}>{"Learn more about emergency types ⓘ"}</Text>
                    </TouchableOpacity>

                    <View style={{ alignItems: "center", }}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Describe the incident (optional)..."
                            placeholderTextColor="#7d7a7a"
                            multiline={true}
                            numberOfLines={3}
                            value={incidentMessage}
                            onChangeText={setIncidentMessage}
                        />
                    </View>
                    <TouchableOpacity 
                        style={[
                            styles.submitButton, 
                            (!incidentMessage && !selectedType) && styles.submitButtonDisabled
                        ]} 
                        onPress={
                        async () => {
                            try {
                                const response = await fetch(`${backend_url}/alarm/${studentID}`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        emergency: parseInt(selectedType),
                                        message: incidentMessage || 'none', // Use the state variable here
                                        status: 'ongoing'
                                    })
                                });
                                const data = await response.json();
                                if (data.success) {
                                    console.log("Type sent");
                                    setCurrentAlarmId(data.alarm.id);
                                }
                            } catch (err) {
                                console.log("Failed to send the alarm: " + err.message);
                            }
                        }
                        }
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={styles.submitButtonText}>Send Incident Details</Text>
                        )}
                    </TouchableOpacity>
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
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#e74c3c" />
                    <Text style={styles.loadingText}>Connecting to server...</Text>
                    <Text style={styles.subLoadingText}>Initial request may take up to 1 minute to wake up the service.</Text>
                </View>
            )}
            { modalVisible && <EmergencyInfoModal visible={modalVisible} onClose={setModalVisible}/> }
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
    },
        loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    subLoadingText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 40,
        marginTop: 5,
    },
    submitButton: {
        backgroundColor: '#007AFF', // Standard iOS Blue or choose #e74c3c for Alert Red
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    submitButtonDisabled: {
        backgroundColor: '#cccccc',
    },
    submitButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    textInput: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
        marginTop: 20,
        width: "90%",
        borderWidth: 1,
        borderColor: '#e0e0e0',
        fontSize: 14,
        color: '#333',
        textAlignVertical: 'top', // Ensures text starts at the top for multiline
        minHeight: 80,
    },
});