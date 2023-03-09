import React, { useState} from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import FormButton from './FormButton';
import FormInput from './FormInput';
// import { AuthContext } from './AuthProv';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import 'firebase/auth';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase'


export default function SignupScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // const auth = getAuth();
  // const { register } = useContext(AuthContext);

  const handleSignup = async () => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user)
      .then(() => {
        // Password reset email sent successfully
        Alert.alert('Email verification email sent', `An email has been sent to ${email} with instructions to verify your email.`);
      })
      .catch((error) => {
        // An error occurred while sending the password reset email
        console.log(error.message);
      });
  }
 
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Create an account</Text>
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
      <FormButton buttonTitle='Signup' onPress={handleSignup} />
      <Button style={styles.button} title="Back to Login" onPress={() => navigation.replace('Login')} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 24,
    marginBottom: 10
  },
  button: {
    width: '80%',
    height: 48,
    marginTop: 16,
  }
});