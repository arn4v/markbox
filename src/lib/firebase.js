import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";

export const useFirebase = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain:
        process.env.REACT_APP_FIREBASE_PROJECT_ID + ".firebaseapp.com",
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_PROJECT_ID + ".appspot.com",
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID,
    });
  }
  const auth = firebase.auth();
  const firestore = firebase.firestore();

  return { fb: firebase, auth, firestore };
};
