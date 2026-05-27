// Firebase initialization
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCvZB3zzGTCTBvdEzHXolb8Y1EePWlBM2U",
  authDomain: "aidentel.firebaseapp.com",
  projectId: "aidentel",
  storageBucket: "aidentel.firebasestorage.app",
  messagingSenderId: "922222517687",
  appId: "1:922222517687:web:479edc0718340db6ab1c32",
  measurementId: "G-PJBE104JWH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let analytics = null;

isSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  })
  .catch(() => {
    analytics = null;
  });

export { app, db, analytics };
