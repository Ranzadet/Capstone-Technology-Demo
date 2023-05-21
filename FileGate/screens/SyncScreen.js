import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Image, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import {userinfo} from './LoginScreen'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SyncScreen = () => {
    const [savedTime, setSavedTime] = useState('')
    const [timeChanged, setTimeChanged] = useState(false);

    useEffect(() => {
        retrieveSavedTime();
        setTimeChanged(false);
    }, [timeChanged]);

    const retrieveSavedTime = async () => {
        try {
          const time = await AsyncStorage.getItem('clickTime');
          console.log("Time outside: ", time);
          if (time !== null) {
            console.log("Time inside: ", formatDate(time));
            setSavedTime(formatDate(time));
          }
        } catch (error) {
          console.error('Error retrieving saved time:', error);
        }
    };

    const formatDate = (dateString) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        
        const date = new Date(Number(dateString));
        date.setUTCHours(date.getUTCHours() - 4);
        console.log("new date: ", date);
        const day = days[date.getUTCDay()];
        const month = months[date.getUTCMonth()];
        const year = date.getUTCFullYear();
        const dayOfMonth = date.getUTCDate();
        let hours = date.getUTCHours();
        const minutes = String(date.getUTCMinutes()).padStart(2, '0'); // Ensure two-digit representation
        const seconds = String(date.getUTCSeconds()).padStart(2, '0'); // Ensure two-digit representation
        const ampm = hours >= 12 ? 'PM' : 'AM';
    
        // Convert hours to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12;

        return `${day}. ${month} ${dayOfMonth}, ${year} ${hours}:${minutes}:${seconds} ${ampm} EST`;
    };

    const handleSync = async () => {
        const url = 'https://script.google.com/macros/s/AKfycbzXhGCmhQ6nEBl6dJ1kn0oJqTCLrqnkc5Hk215nJrHZMhZnxzBObBbBhaBuM0wvD4D0_w/exec';
        try {
            console.log("start sync")
            await axios.post(url);
            console.log("synced")

            const currentTime = new Date().getTime().toString();
            await AsyncStorage.setItem('clickTime', currentTime);
            console.log('Click time saved successfully:', currentTime);
            setTimeChanged(true);
        }
        catch (error) {
            console.log(error)
        }
    }

    // const saveClickTime = async () => {
    //     try {
    //       const currentTime = new Date().getTime().toString();
    //       await AsyncStorage.setItem('clickTime', currentTime);
    //       console.log('Click time saved successfully:', currentTime);
    //     } catch (error) {
    //       console.error('Error saving click time:', error);
    //     }
    // };

    return (
        // <Button title="Sync" onPress={handleSync}></Button>
        <View style={styles.container}>
            <Text style={{ maxWidth: 300, textAlign: 'center', fontSize: 18 }}>After verifying that newly uploaded files in the Firebase Console are relevant for research, press the Sync! button to export their data to your Google Sheet.</Text>

            <Text></Text>
            
            <TouchableOpacity onPress={handleSync} style={styles.button}>
                <Text>Sync!</Text>
            </TouchableOpacity>

            <Text>Last Sync: {savedTime}</Text>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
    
export default SyncScreen;