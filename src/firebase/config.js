import { initializeApp } from "firebase/app";
// Change getFirestore to initializeFirestore
import { initializeFirestore } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
 
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