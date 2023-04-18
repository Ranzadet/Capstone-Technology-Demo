import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Image, Button } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import {userinfo} from './LoginScreen'
import axios from 'axios'

const SyncScreen = () => {

    const handleSync = async () => {
        const url = 'https://script.google.com/macros/s/AKfycbzVyH_uE7pybFN2i2rZk-_24Uzw6p_T0mGTNDxDYV8jdSmu1BiiX-jkaA9DEHqt3_dD/exec';
        try {
            console.log("start sync")
            await axios.post(url);
            console.log("synced")
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        // <Button title="Sync" onPress={handleSync}></Button>
        <View style={styles.container}>
            <TouchableOpacity onPress={handleSync} style={styles.button}>
                <Text>Sync!</Text>
            </TouchableOpacity>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
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