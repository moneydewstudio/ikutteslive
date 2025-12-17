import { initializeApp, getApp, getApps } from "firebase/app";

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
let app;
try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
} catch (error) {
  console.error("Firebase Initialization Error:", error);
  // Fallback to getApp if initialization failed due to duplicate existence
  try {
    app = getApp();
  } catch (e) {
    throw error;
  }
}

export { app };