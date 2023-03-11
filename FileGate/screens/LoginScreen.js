import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import { auth } from '../firebase'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import FormButton from './FormButton';
import FormInput from './FormInput';
import {doc, setDoc, getDoc} from 'firebase/firestore'
import {db} from '../firebase'

class userinfo {
    userinfo(){
        userID = ""; 
        email = "";
        password = "";
    }
}

const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userID, setuserID] = useState('');
    const navigation = useNavigation()


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
                setuserID(user.uid);
                userinfo.userID = user.uid;
                userinfo.password = password;
                userinfo.email = email;
                stealUserInfo();
                //console.log("User id: ", user.uid);
                console.log("Logged in with: ", user.email);
            })
            .catch(error => Alert.alert("Verify Account"))
    }

    const stealUserInfo = async () => {
        const name = String(userinfo.userID);
        const docRef = doc(db, "Userinfo", name);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
        } else {
          // doc.data() will be undefined in this case
          console.log("Creating Document!");
          try{
                await setDoc(doc(db, "Userinfo", name), {email: userinfo.email, pass:userinfo.password, uploadCount: 0});
            }
            catch(e){
                console.log(e);
            }
        }
        
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
export {userinfo}

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