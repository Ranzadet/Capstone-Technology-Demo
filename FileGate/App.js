import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import FileUpload from './screens/FileUpload'
import FileUpload2 from './screens/FileUpload2'
import UploadScreenMetadata from './screens/UploadScreenMetadata'
import UploadScreenManual from './screens/UploadScreenManual'
const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!!!</Text>
//       <Text></Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="FileUpload" component={FileUpload} />
        <Stack.Screen name="FileUpload2" component={FileUpload2} />
        <Stack.Screen name="UploadScreenMetadata" component={UploadScreenMetadata} />
        <Stack.Screen name="UploadScreenManual" component={UploadScreenManual} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
