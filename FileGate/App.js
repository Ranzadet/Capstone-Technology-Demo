import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {useState} from 'react'
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
import { UploadProvider } from './screens/UploadContext';
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
  const [uploadState, setUploadState] = useState(0);

  return (
  // <Providers />; 
  
    <UploadProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen}/>
          <Stack.Screen name="ResetPassword" component={ResetPassword}/>
          <Stack.Screen name="Signup" component={SignupScreen}/>
          <Stack.Screen name="Manage Files" component={DownloadScreen} />
          <Stack.Screen name="Home" component={HomeScreen} uploadState = {uploadState} setUploadState={setUploadState}/>
          <Stack.Screen name="UploadScreenCombined" component={UploadScreenCombined} uploadState = {uploadState} setUploadState={setUploadState}/>
          <Stack.Screen name="SyncScreen" component={SyncScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UploadProvider>
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
