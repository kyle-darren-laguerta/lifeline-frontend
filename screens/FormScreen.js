import { SafeAreaView } from "react-native-safe-area-context";
import Dropdown from "../components/Dropdown";
import { useState, useEffect } from "react";
import { TouchableOpacity, Text, BackHandler, Alert } from "react-native";
import EmergencyLevelButton from "../components/EmergencyLevelButton";
import Header from "../components/Header";

export default function FormScreen({ navigation, route }) {
    const { studentID } = route.params;
    const [emergencyLevel, setEmergencyLevel] = useState("");
    const [currentAlarmId, setCurrentAlarmId] = useState("");

    // Create a POST request alarm to the server
    useEffect(() => {
        async function createOrGetAlarm() {
            try {
                console.log(studentID);
                const response = await fetch(`http://192.168.1.63:3000/alarm/${studentID}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        emergency: false,
                        message: {
                            type: '',
                            additionalInfo: ''
                        },
                        status: 'ongoing'
                    })
                });
                
                const data = await response.json();

                if (data.success) {
                    setCurrentAlarmId(data.alarm.id);
                    console.log("Success sending the alarm");
                } else {
                    console.log(data.message);
                }
            } catch (err) {
                console.log("Failed to send the alarm: " + err.message);
            }
        }

        createOrGetAlarm();
    });

    useEffect(() => {
        const backAction = () => {
        // Show an alert to confirm they want to exit the emergency
        Alert.alert("Hold on!", "Are you sure you want to exit? The emergency response is active.", [
            { text: "Cancel", onPress: () => null, style: "cancel" },
            { text: "YES, EXIT", onPress: () => BackHandler.exitApp() } // Or navigation.goBack()
        ]);
        return true; // Prevents the default back action
        };

        const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
        );

        // Clean up the listener when the screen is unmounted
        return () => backHandler.remove();
    }, []);

    const emergency = async () => {
        if (!currentAlarmId) {
            console.log("No alarm created yet");
            return;
        }

        try {
            const response = await fetch(`http://192.168.1.63:3000/alarm/${studentID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    emergency: true,
                    status: 'ongoing'
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                console.log("Emergency activated");
            } else {
                console.log("Failed to activate emergency");
            }
        } catch (err) {
            console.log("Error: " + err.message);
        }
    };

    const falseAlarm = async () => {
        if (!currentAlarmId) {
            console.log('No alarm created yet');
            return;
        }

        try {
            const response = await fetch(`http://192.168.1.63:3000/alarm/${currentAlarmId}/false`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    authority: 'STUDENT'
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                console.log("Success to mark False Alarm")
                
                // Wait 1 second then return to dashboard
                setTimeout(() => {
                    console.log("Back to scan");
                }, 1000);
            } else {
                console.log("Failed to mark False Alarm");
            }
        } catch (err) {
            console.log("Error: " + err.message);
        }
    };

    const emergencyLevels = ["Level 1", "Level 2", "Level 3"];

    return (
        <SafeAreaView>
            <Header style={{ marginBottom: 50, }}/>
            <Dropdown options={["type a", "type b", "type c", "type d"]} placeHolder={"Select type"} />
            <EmergencyLevelButton color="#147a00" imgPath={require("../assets/images/notify-icon.png")} headerText={"False Alarm"} onPress={() => { falseAlarm() }}/>
            <EmergencyLevelButton color="#7a0000" imgPath={require("../assets/images/emergency-icon.png")} headerText={"Notify as Emergency"} onPress={() => { emergency() }}/>
            {/* <EmergencyLevelButton color={"#ffea25"} imgPath={require("../assets/images/e-level-1.png")} headerText={"LEVEL 1"} onPress={() => navigation.navigate("Level1EmergencyScreen")}/>
            <EmergencyLevelButton color={"#cc4e00"} imgPath={require("../assets/images/e-level-2.png")} headerText={"LEVEL 2"} onPress={() => navigation.navigate("Level2EmergencyScreen")}/>
            <EmergencyLevelButton color={"#7a0000"} imgPath={require("../assets/images/e-level-3.png")} headerText={"LEVEL 3"} onPress={() => navigation.navigate("Level3EmergencyScreen")} /> */}
        </SafeAreaView>
    );
}