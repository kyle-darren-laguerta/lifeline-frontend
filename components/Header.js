import { View, Text } from "react-native";

export default function Header() {

    return (
        <View style={{ height: 100}}>
            <View style={{ flex: 2, backgroundColor: "#86112e" }}>
                <Text>L.I.F.E.L.I.N.E</Text>
                <Text>Life-saving Integrated First-aid and Emergency Link for Immediate Notification in Education </Text>
            </View>
            <View style={{ flex: 3, backgroundColor: "#740f28" }}></View>
        </View>
    );
}