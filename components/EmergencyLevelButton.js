import { TouchableOpacity, Image, Text, Animated, StyleSheet } from "react-native";
import { useEffect, useRef } from "react";

export default function EmergencyLevelButton({ color, imgPath, headerText, ...rest }) {
    // 1. Initialize the animation value (1 = 100% size)
    const scaleValue = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // 2. Define the pulse sequence
        const pulse = Animated.sequence([
            Animated.timing(scaleValue, {
                toValue: 1.05, // Scale up to 105%
                duration: 800,
                useNativeDriver: true, // Use native driver for performance
            }),
            Animated.timing(scaleValue, {
                toValue: 1, // Scale back down to 100%
                duration: 800,
                useNativeDriver: true,
            }),
        ]);

        // 3. Loop the animation infinitely
        Animated.loop(pulse).start();
    }, [scaleValue]);

    return (
        // 4. Wrap the button in an Animated.View to apply the transform        
        <TouchableOpacity 
            activeOpacity={0.8}
            style={[styles.button, { backgroundColor: color }]}
            {...rest}
        >
            <Text style={styles.text}>{headerText}</Text>
            <Animated.View 
                style={{ 
                    alignItems: 'center', 
                    transform: [{ scale: scaleValue }] 
                }}
            >
            <Image
                source={imgPath}
                style={styles.image}
            />
            </Animated.View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: "80%",
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 12, // Smoother corners
        alignSelf: "center",
        marginVertical: 10,
        // Optional: Add a shadow to make it pop
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    text: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
    image: {
        width: 40,
        height: 40,
        resizeMode: "contain" 
    }
});