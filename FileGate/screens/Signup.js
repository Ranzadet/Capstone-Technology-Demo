import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FormButton from './FormButton';
import FormInput from './FormInput';
// import { AuthContext } from './AuthProv';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function SignupScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const { register } = useContext(AuthContext);
  const handleSignup = () => {
    auth().createUserWithEmailAndPassword(email,password)
    .catch(error => alert(error.message))
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
  }
});