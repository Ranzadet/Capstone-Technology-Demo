import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useContext} from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { auth } from '../firebase';
import { userinfo } from './LoginScreen'
import { UploadContext } from './UploadContext';

const HomeScreen = (props) => {
  const { uploadState, setUploadState } = useContext(UploadContext);
  const [adminVar, setAdminVar] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigation = useNavigation();
  
  const handleSignOut = () => {
    auth
    .signOut()
    .then(() => {
      navigation.replace('Login');
    })
    .catch((error) => alert(error.message));
  };

  useEffect(() => {
    setUserEmail(auth.currentUser?.email);
    const interval = setInterval(() => {
      // Check the value of myImportedVar
      if (userinfo.admin === true) {
        // Do something if the value is what you're looking for
        setAdminVar(true);
      }
      else {
        setAdminVar(false);
      }
    }, 10); // Check the value every 10 milliseconds

    // Clean up the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  const uploadAlert = () => {
    Alert.alert("Upload Complete!");
    setUploadState(0);
  }
  
  return (
    <View style={styles.container}>
    <View style={styles.header}>
    <Text style={styles.logo}> FileGate </Text>
    </View>
    <Text style={styles.email}>Welcome, {userEmail}!</Text>
    {uploadState === 1 && <Text>Upload In progress!</Text>}
    <View style={styles.buttonsContainer}>
    {/* <TouchableOpacity
          onPress={() => {
            navigation.navigate('Upload with Manual Data Input');
          }}
          style={[styles.button, styles.uploadButton]}
        >
          <Text style={[styles.buttonText, styles.uploadButtonText]}>Upload Files Manual</Text>
        </TouchableOpacity> */}
    <TouchableOpacity onPress={handleSignOut} style={[styles.button, styles.signOutButton]}>
    <Text style={[styles.buttonText, styles.signOutButtonText]}>Sign Out</Text>
    </TouchableOpacity>
    {/* <TouchableOpacity
      onPress={() => {
        navigation.navigate('UploadScreen');
      }}
      style={[styles.button, styles.uploadButton]}
    >
      <Text style={[styles.buttonText, styles.uploadButtonText]}>Upload Files</Text>
    </TouchableOpacity> */}
    {/* <TouchableOpacity
      onPress={() => {
        navigation.navigate('UploadScreenManual');
      }}
      style={[styles.button, styles.uploadButton]}
    >
      <Text style={[styles.buttonText, styles.uploadButtonText]}>Upload Files Manual</Text>
    </TouchableOpacity> */}
    <TouchableOpacity
    onPress={() => {
    navigation.navigate("Manage Files");
    }}
    style={styles.button}
    >
      <Text style={styles.buttonText}>Manage Files</Text>

    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('UploadScreenCombined');
      }}
      style={[styles.button, styles.uploadButton]}
      >
        <Text style={[styles.buttonText, styles.uploadButtonText]}>Upload Files</Text>
      </TouchableOpacity>
    <View>
    {adminVar ? 
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('SyncScreen');
        }}
        style={[styles.button, styles.uploadButton]}
      >
        <Text style={[styles.buttonText, styles.uploadButtonText]}>Sync Files</Text>
      </TouchableOpacity> : null
    }
    </View>
    </View>
    </View>
    );
    };
  
    const styles = StyleSheet.create({
      container: {
      flex: 1,
      backgroundColor: '#fff',
      },
      header: {
      backgroundColor: '#6646ee',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 80,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      },
      logo: {
      color: '#fff',
      fontSize: 24,
      fontWeight: 'bold',
      },
      email: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 30,
      marginBottom: 20,
      textAlign: 'center',
      },
      buttonsContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      },
      button: {
      borderRadius: 10,
      paddingVertical: 15,
      paddingHorizontal: 50,
      marginVertical: 10,
      width: '80%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#0782F9',
      },
      signOutButton: {
      backgroundColor: '#FF6347',
      borderColor: '#FF6347',
      },
      signOutButtonText: {
      color: '#fff',
      },
      uploadButton: {
      backgroundColor: '#0782F9',
      borderColor: '#0782F9',
      },
      uploadButtonText: {
      color: '#fff',
      },
      buttonText: {
      fontWeight: '700',
      fontSize: 16,
      },
      });
      
      export default HomeScreen;
