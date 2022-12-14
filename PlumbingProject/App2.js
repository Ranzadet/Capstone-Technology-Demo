import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import UploadScreen from "./screens/UploadScreen";

export default function App() {
    return (
        <View style={styles.container}>
            <UploadScreen/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})