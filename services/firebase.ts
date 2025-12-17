import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";

/**
 * Firebase Configuration.
 */
const firebaseConfig = {
  apiKey: "AIzaSyA7DFNBrnE33VQcnBYYLaytYGGyaQjGQyk",
  authDomain: "ikuttes-64d28.firebaseapp.com",
  projectId: "ikuttes-64d28",
  storageBucket: "ikuttes-64d28.firebasestorage.app",
  messagingSenderId: "449329796304",
  appId: "1:449329796304:web:5b551c990801f66d52bad5",
  measurementId: "G-JS17DNXM11"
};

// Singleton pattern to ensure only one instance exists
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export { app };