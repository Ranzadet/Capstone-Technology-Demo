import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import { auth } from '../firebase'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import FormButton from './FormButton';
import FormInput from './FormInput';

const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user && user.emailVerified) {
                navigation.replace("Home");
            }
            // else if (user){
            //     Alert.alert("verify email");
            // }
            // else{
            //     Alert.alert("Not a Valid Account");
            // }
        })

        return () => {
            unsubscribe;
            signOut(auth);
        }
    }, [])

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log("Logged in with: ", user.email)
            })
            .catch(error => Alert.alert("Verify Account"))
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome to FileGate</Text>
            <FormInput
                value={email}
                placeholderText='Email'
                onChangeText={userEmail => setEmail(userEmail)}
                autoCapitalize='none'
                keyboardType='email-address'
                autoCorrect={false}
            />
            <FormInput
                value={password}
                placeholderText='Password'
                onChangeText={userPassword => setPassword(userPassword)}
                secureTextEntry={true}
            />
            <FormButton buttonTitle='Login' onPress={handleLogin} />
            <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigation.replace('Signup')}
            >
                <Text style={styles.navButtonText}>New user? Join here</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigation.replace('ResetPassword')}
            >
                <Text style={styles.navButtonText}>Forgot Password?</Text>
            </TouchableOpacity>
            {/* <FormButton buttonTitle='Forgot Password?' onPress={() => navigation.navigate('ResetPassword')} /> */}
       </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#f5f45f5',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    text: {
      fontSize: 24,
      marginBottom: 10
    },
    navButton: {
      marginTop: 15
    },
    navButtonText: {
      fontSize: 20,
      color: '#6646ee'
    }
  });