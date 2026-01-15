import { SafeAreaView } from "react-native-safe-area-context";
import Dropdown from "../components/Dropdown";
import { useState } from "react";
import { TouchableOpacity, Text } from "react-native";

export default function FormScreen() {
    const [emergencyLevel, setEmergencyLevel] = useState("");

    const emergencyLevels = ["Level 1", "Level 2", "Level 3"];

    return (
        <SafeAreaView>
            <Dropdown options={emergencyLevels} onSelect={(item) => setEmergencyLevel(item)}/>
            <TouchableOpacity>
                <Text>Send</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}