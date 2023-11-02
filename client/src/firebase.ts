// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-bc918.firebaseapp.com",
  projectId: "real-estate-bc918",
  storageBucket: "real-estate-bc918.appspot.com",
  messagingSenderId: "199552629518",
  appId: "1:199552629518:web:657c87ab4704e6770f755f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);