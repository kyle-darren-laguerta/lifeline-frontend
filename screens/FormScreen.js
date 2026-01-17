import { SafeAreaView } from "react-native-safe-area-context";
import Dropdown from "../components/Dropdown";
import { useState, useEffect } from "react";
import { TouchableOpacity, Text, BackHandler, Alert } from "react-native";
import EmergencyLevelButton from "../components/EmergencyLevelButton";
import Header from "../components/Header";

export default function FormScreen({ navigation }) {
    const [emergencyLevel, setEmergencyLevel] = useState("");

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

    const emergencyLevels = ["Level 1", "Level 2", "Level 3"];

    return (
        <SafeAreaView>
            <Header style={{ marginBottom: 50, }}/>
            <Dropdown options={["type a", "type b", "type c", "type d"]} placeHolder={"Select type"} />
            <Text>{"...other form inputs"}</Text>
            <EmergencyLevelButton color="#147a00" imgPath={require("../assets/images/notify-icon.png")} headerText={"Notify"}/>
            <EmergencyLevelButton color="#7a0000" imgPath={require("../assets/images/emergency-icon.png")} headerText={"Notify as Emergency"}/>
            {/* <EmergencyLevelButton color={"#ffea25"} imgPath={require("../assets/images/e-level-1.png")} headerText={"LEVEL 1"} onPress={() => navigation.navigate("Level1EmergencyScreen")}/>
            <EmergencyLevelButton color={"#cc4e00"} imgPath={require("../assets/images/e-level-2.png")} headerText={"LEVEL 2"} onPress={() => navigation.navigate("Level2EmergencyScreen")}/>
            <EmergencyLevelButton color={"#7a0000"} imgPath={require("../assets/images/e-level-3.png")} headerText={"LEVEL 3"} onPress={() => navigation.navigate("Level3EmergencyScreen")} /> */}
        </SafeAreaView>
    );
}