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
    const [isReportRequestLoading, setIsReportRequestLoading] = useState(false);
    const [isFalseAlarmRequestLoading, setIsFalseAlarmRequestLoading] = useState(false);
    const [incidentMessage, setIncidentMessage] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [isStudentInfoLoading, setIsStudentInfoLoading] = useState(false);
    const [studentData, setStudentData] = useState(null);
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

    // This POST request is automatically send when the app redirect to this screen
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

    // GET the student data
    useEffect(() => {
        const fetchStudentDashboard = async () => {
            try {
                setIsStudentInfoLoading(true);
                // Replace backend_url and studentID with your variables
                const response = await fetch(`${backend_url}/dashboard/student/${studentID}`);
                const data = await response.json();

                if (data.success) {
                    setStudentData(data); // This sets the entire object (role, student, ongoingAlarm)
                } else {
                    console.error("Server error:", data.message);
                }
            } catch (error) {
                console.error("Network error:", error);
            } finally {
                setIsStudentInfoLoading(false);
            }
        };

        if (studentID) {
            fetchStudentDashboard();
        }
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

    // Deprecated
    
    // const emergency = async () => {
    //     try {
    //         const response = await fetch(`${backend_url}/alarm/${studentID}`, {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ emergency: true, status: 'ongoing' })
    //         });
    //         const data = await response.json();
    //         startAlarm();
    //         setIsEmergenycActive(true);
    //         if (data.success) Alert.alert("Success", "Emergency services notified.");
    //         setTimeout(() => {
    //             stopAlarm();
    //         }, 3000);

    //     } catch (err) {
    //         console.log("Error: " + err.message);
    //     }
    // };

    const falseAlarm = async () => {
        try {
            setIsFalseAlarmRequestLoading(true);
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
            Alert.alert("Server Error", "The server is unresponsive");
            console.log("Error: " + err.message);
        } finally {
            setIsFalseAlarmRequestLoading(false);
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
                    <Text style={styles.cardTitle}>Student Information</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Student ID:</Text>
                        <Text style={styles.value}>{studentID}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Name:</Text>
                        <Text style={styles.value}>{studentData?.student?.name || "N/A"}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Age:</Text>
                        <Text style={styles.value}>{studentData?.student?.age || "N/A"}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Emergency Contact:</Text>
                        <Text style={styles.value}>{studentData?.student?.emergencyContact || "N/A"}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Medical History:</Text>
                        <Text style={styles.value}>{studentData?.student?.medicalHistory || "N/A"}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Allergies:</Text>
                        <Text style={styles.value}>{studentData?.student?.allergies || "N/A"}</Text>
                    </View>
                </View>

                {/* Incident Details Form */}
                <View style={styles.formCard}>
                    <Text style={styles.cardTitle}>Incident Details</Text>
                    
                    <Dropdown 
                        options={["1", "2", "3"]}
                        placeHolder={"Select emergency type"} 
                        style={{ marginBottom: 12 }}
                        onSelect={(item) => setSelectedType(item)}
                    />

                    <TouchableOpacity style={{ alignItems: "center", marginBottom: 16 }} onPress={() => setModalVisible(true)}>
                        <Text style={{ textDecorationLine: "underline", color: "#86112e", fontSize: 12, fontWeight: '600' }}>{"Learn more about emergency types ⓘ"}</Text>
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
                                setIsReportRequestLoading(true);

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
                                Alert.alert("Server Error", "The server is unresponsive");
                                console.log("Failed to send the alarm: " + err.message);
                            } finally {
                                setIsReportRequestLoading(false);
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
                        color="#86112e" 
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
                    <Text style={styles.loadingText}>Sending the alarm!</Text>
                    <Text style={styles.subLoadingText}>We are now notifying the staffs and admin and requesting for student data.</Text>
                </View>
            )}
            {isFalseAlarmRequestLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#e74c3c" />
                    <Text style={styles.loadingText}>Notifying as false alarm...</Text>
                    <Text style={styles.subLoadingText}>Please standby.</Text>
                </View>
            )}
            {isReportRequestLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#e74c3c" />
                    <Text style={styles.loadingText}>Sending incident details...</Text>
                    <Text style={styles.subLoadingText}>Make sure the details you input is correct.</Text>
                </View>
            )}
            { modalVisible && <EmergencyInfoModal visible={modalVisible} onClose={setModalVisible}/> }
            <EmergencyBorder active={isEmergencyActive}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    scrollContent: { padding: 16, paddingBottom: 40 },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#86112e',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#86112e',
    },
    formCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        elevation: 3,
        shadowColor: '#86112e',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#86112e',
    },
    cardTitle: { 
        fontSize: 18, 
        fontWeight: '700', 
        marginBottom: 18, 
        color: '#86112e',
        letterSpacing: 0.3,
    },
    row: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 14,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    label: { 
        color: '#666', 
        fontSize: 13,
        fontWeight: '500',
        flex: 1,
    },
    value: { 
        fontWeight: '600', 
        color: '#333',
        fontSize: 14,
        flex: 1,
        textAlign: 'right',
    },
    
    actionSection: { marginBottom: 32 },
    sectionTitle: { 
        fontSize: 12, 
        fontWeight: '700', 
        color: '#86112e', 
        marginBottom: 14, 
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    directorySection: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        marginBottom: 24,
    },
    contactRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
        marginBottom: 2,
    },
    contactInfo: { 
        flexDirection: 'row', 
        alignItems: 'center',
        flex: 1,
    },
    contactIcon: { 
        fontSize: 28, 
        marginRight: 14,
        width: 40,
        textAlign: 'center',
    },
    deptName: { 
        fontWeight: '700', 
        color: '#1a1a1a',
        fontSize: 14,
        marginBottom: 2,
    },
    deptPhone: { 
        color: '#888', 
        fontSize: 12,
        fontWeight: '500',
    },
    callButton: {
        color: '#fff',
        backgroundColor: '#86112e',
        fontWeight: '700',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
        overflow: 'hidden',
        fontSize: 12,
        elevation: 2,
        shadowColor: '#86112e',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    subLoadingText: {
        fontSize: 12,
        color: '#ddd',
        textAlign: 'center',
        paddingHorizontal: 40,
        marginTop: 8,
    },
    submitButton: {
        backgroundColor: '#86112e',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        elevation: 4,
        shadowColor: '#86112e',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
    },
    submitButtonDisabled: {
        backgroundColor: '#d0d0d0',
        elevation: 1,
        shadowOpacity: 0.1,
    },
    submitButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    textInput: {
        backgroundColor: '#f5f7fa',
        borderRadius: 12,
        padding: 14,
        marginTop: 18,
        width: "90%",
        borderWidth: 2,
        borderColor: '#e8e8e8',
        fontSize: 14,
        color: '#333',
        textAlignVertical: 'top',
        minHeight: 100,
        fontWeight: '500',
    },
});