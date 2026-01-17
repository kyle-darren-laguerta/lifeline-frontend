import { View, Text } from "react-native";
import { useFonts } from 'expo-font';

export default function Header() {
    const [loaded] = useFonts({
        'AlphaSlabOne-Regular': require('../assets/fonts/AlfaSlabOne-Regular.ttf'),
    });

    return (
        <View style={{ height: 100, marginBottom: 30, }}>
            <View style={{ flex: 4, backgroundColor: "#86112e", alignItems: "center", justifyContent: "center", }}>
                <View style={{ width: "60%", alignItems: "center", justifyContent: "center", }}>
                    <Text style={{ color: "white", fontSize: 30, fontFamily: "AlphaSlabOne-Regular" }}>L.I.F.E.L.I.N.E</Text>
                    <Text style={{ color: "white", textAlign: "center", fontSize: 9, marginTop: -7, }}>Life-saving Integrated First-aid and Emergency Link for Immediate Notification in Education </Text>
                </View>
            </View>
            <View style={{ flex: 1, backgroundColor: "#740f28" }}></View>
        </View>
    );
}