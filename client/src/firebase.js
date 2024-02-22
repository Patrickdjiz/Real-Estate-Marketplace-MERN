// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, // we import the environment variable VITE_FIREBASE_API_KEY
  authDomain: "real-estate-marketplace-mern.firebaseapp.com",
  projectId: "real-estate-marketplace-mern",
  storageBucket: "real-estate-marketplace-mern.appspot.com",
  messagingSenderId: "529311557905",
  appId: "1:529311557905:web:1672508eef18dc4bd384b0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);