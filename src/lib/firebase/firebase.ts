import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyA3wfHusu8DzECrFx1RhBfTPS42HwrYcDA",
  authDomain: "gardemn.firebaseapp.com",
  projectId: "gardemn",
  storageBucket: "gardemn.firebasestorage.app",
  messagingSenderId: "203266950040",
  appId: "1:203266950040:web:8404197e1231722d4661ed"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);