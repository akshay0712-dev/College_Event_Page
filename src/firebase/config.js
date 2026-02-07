import { initializeApp } from "firebase/app";
// Change getFirestore to initializeFirestore
import { initializeFirestore } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAMDaA7hco4hNXzphZa62EkJ2E-3qKq5zE",
  authDomain: "gec-fresher-party.firebaseapp.com",
  projectId: "gec-fresher-party",
  storageBucket: "gec-fresher-party.firebasestorage.app",
  messagingSenderId: "473377324797",
  appId: "1:473377324797:web:7d62e990a1a70b6a4e8894"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Firestore FIXED
// Use initializeFirestore to apply settings like experimentalForceLongPolling
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

// ✅ Authentication
export const auth = getAuth(app);

// ✅ Storage
export const storage = getStorage(app);

export default app;