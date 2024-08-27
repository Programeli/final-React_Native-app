// firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBN7BhVg2dyXVGd3q508McIMXelzCJB6pc",
  authDomain: "final-app-153cf.firebaseapp.com", // This value was not in your JSON. If you don't have it, you might need to add Firebase Authentication setup later.
  projectId: "final-app-153cf",
  storageBucket: "final-app-153cf.appspot.com",
  messagingSenderId: "1085087768696", // This value is not used in the config object directly but is part of the `firebaseConfig`
  appId: "1:1085087768696:android:05124510e6ad58a702cd8d", // This is not used in the config object directly, but you will use `appId` for Android configurations if needed.
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
