import { TouchableOpacity, Image, Text } from "react-native";

export default function EmergencyLevelButton({ color, imgPath, headerText, ...rest }) {
    return (
        <TouchableOpacity 
            style={{
                width: "80%",           // Width of the button
                // Remove height: "50%", it's making the button half the screen height
                padding: 15,            // Use padding to give the button height
                flexDirection: "row",
                backgroundColor: color,
                alignItems: "center",    // Vertically center text and image
                justifyContent: "space-between", // Push text left, image right
                borderRadius: 8,
                alignSelf: "center",
                marginVertical: 10
            }}
            {...rest}
        >
            <Text
                style={{
                    fontSize: 18,       // Changed from 2 (which was too small to see)
                    fontWeight: "bold",
                    color: "white",
                }}
            >
                {headerText}
            </Text>
            
            <Image
                source={imgPath}
                style={{
                    width: 40,          // MANDATORY: Define a width
                    height: 40,         // MANDATORY: Define a height
                    resizeMode: "contain" 
                }}
            />
        </TouchableOpacity>
    );
}