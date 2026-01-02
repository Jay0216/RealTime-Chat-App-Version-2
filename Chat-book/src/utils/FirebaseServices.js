import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";



export const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: "react-chat-book.firebaseapp.com",
  projectId: "react-chat-book",
  storageBucket: import.meta.env.FIREBASE_STORAGE_BUCKET_ID,
  messagingSenderId: import.meta.env.FIREBASE_MESSAGE_SENDER_ID,
  appId: import.meta.env.FIREBASE_APP_ID,
  measurementId: import.meta.env.FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.FIREBASE_DATABASE_URL
}


// Default initialized app (optional)
export const firebase_services = initializeApp(firebaseConfig);

// Create (or reuse) a named Firebase app instance
export function getFirebaseApp(name = "[DEFAULT]") {
  const existing = getApps().find(app => app.name === name);
  return existing || initializeApp(firebaseConfig, name);
}

// Get Auth for a specific app
export function getFirebaseAuth(appName = "[DEFAULT]") {
  const app = getFirebaseApp(appName);
  return getAuth(app);
}