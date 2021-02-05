import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";

export const getFirebase = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain:
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID + ".firebaseapp.com",
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket:
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID + ".appspot.com",
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    });
  }
  const auth = firebase.auth();
  const firestore = firebase.firestore();

  return { fb: firebase, auth, firestore };
};
