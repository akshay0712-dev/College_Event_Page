import { initializeApp } from "firebase/app";
// Change getFirestore to initializeFirestore
import { initializeFirestore } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDaunaGODx0mGSgCSY6wdaf_Guets3ELnU",
  authDomain: "event-9ebcd.firebaseapp.com",
  projectId: "event-9ebcd",
  storageBucket: "event-9ebcd.firebasestorage.app",
  messagingSenderId: "747181611512",
  appId: "1:747181611512:web:48f34fbfa2fc9d538e5e0d",
  measurementId: "G-39E0BRLH5K"
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
