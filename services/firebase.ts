import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";

/**
 * Firebase Configuration.
 */
// TEAM_012: switch Firebase project config to canonical 'ikuttes' via Vite env vars
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId || !firebaseConfig.appId) {
  throw new Error('Missing Firebase config env vars (VITE_FIREBASE_*).');
}

// Singleton pattern to ensure only one instance exists
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export { app };