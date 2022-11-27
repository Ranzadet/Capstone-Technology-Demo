// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7BdKxv2axy4QriJHmULuc7BEU3rq6MVw",
  authDomain: "filegate-rn-auth.firebaseapp.com",
  projectId: "filegate-rn-auth",
  storageBucket: "filegate-rn-auth.appspot.com",
  messagingSenderId: "866567881485",
  appId: "1:866567881485:web:f125140a8b7c987882a644"
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
}
else {
    app = getApp();
}

const auth = getAuth()

export { auth };