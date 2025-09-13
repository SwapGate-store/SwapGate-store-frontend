// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDroR1JsQOfCUunXmIuOVLnGepLNJpAaF8",
  authDomain: "swapgate.firebaseapp.com",
  projectId: "swapgate",
  storageBucket: "swapgate.firebasestorage.app",
  messagingSenderId: "352618661789",
  appId: "1:352618661789:web:016748e312edd714f2d174",
  measurementId: "G-6DH1Z6M19D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;