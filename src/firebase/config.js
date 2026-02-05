import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBRFlZWbXGKW8JFrqh9-xLFXuEWbc3DYhA",
  authDomain: "fresher-party-6a535.firebaseapp.com",
  projectId: "fresher-party-6a535",
  storageBucket: "fresher-party-6a535.firebasestorage.app",
  messagingSenderId: "55653836216",
  appId: "1:55653836216:web:9941414c1f5c52d7805b4d",
  measurementId: "G-38WW3ZD8XS"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);