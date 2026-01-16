import { SafeAreaView } from "react-native-safe-area-context";
import Dropdown from "../components/Dropdown";
import { useState } from "react";
import { TouchableOpacity, Text } from "react-native";
import EmergencyLevelButton from "../components/EmergencyLevelButton";

export default function FormScreen() {
    const [emergencyLevel, setEmergencyLevel] = useState("");

    const emergencyLevels = ["Level 1", "Level 2", "Level 3"];

    return (
        <SafeAreaView>
            <EmergencyLevelButton color={"#ffea25"} imgPath={require("../assets/images/e-level-1.png")} headerText={"LEVEL 1"}/>
            <EmergencyLevelButton color={"#cc4e00"} imgPath={require("../assets/images/e-level-2.png")} headerText={"LEVEL 2"}/>
            <EmergencyLevelButton color={"#7a0000"} imgPath={require("../assets/images/e-level-3.png")} headerText={"LEVEL 3"}/>
        </SafeAreaView>
    );
}