import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "YOUR_DOMAIN",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID || "SENDER_ID",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "APP_ID"
};

let messaging = null;

try {
  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
} catch (error) {
  console.warn("Firebase not configured - notifications disabled");
}

export { messaging };
