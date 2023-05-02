import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen'
import {userinfo} from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
// import FileUpload from './screens/FileUpload'
// import FileUpload2 from './screens/FileUpload2'
import UploadScreen from './screens/UploadScreen'
import UploadScreenManual from './screens/UploadScreenManual'
import UploadScreenCombined from './screens/UploadScreenCombined';
import DownloadScreen from './screens/DownloadScreen'
import SignupScreen from './screens/Signup'
import ResetPassword from './screens/ResetPassword'
import SyncScreen from './screens/SyncScreen';
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
  // <Providers />; 
  
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="ResetPassword" component={ResetPassword}/>
        <Stack.Screen name="Signup" component={SignupScreen}/>
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="UploadScreen" component={UploadScreen} />
        <Stack.Screen name="UploadScreenManual" component={UploadScreenManual} />
        <Stack.Screen name="UploadScreenCombined" component={UploadScreenCombined} />
        <Stack.Screen name="DownloadScreen" component={DownloadScreen} />
        <Stack.Screen name="SyncScreen" component={SyncScreen} />
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
