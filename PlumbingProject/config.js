import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD7BdKxv2axy4QriJHmULuc7BEU3rq6MVw",
    authDomain: "filegate-rn-auth.firebaseapp.com",
    projectId: "filegate-rn-auth",
    storageBucket: "filegate-rn-auth.appspot.com",
    messagingSenderId: "866567881485",
    appId: "1:866567881485:web:f125140a8b7c987882a644"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export {firebase};