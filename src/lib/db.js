/* eslint-disable react-hooks/rules-of-hooks */
import { useFirebase } from "./firebase";
import { v4 as uuid } from "uuid";

const { auth, firestore } = useFirebase();

/**
 * @param {import("firebase").default.auth.UserCredential} [user]
 */
export const createUserDoc = async ({ user }) => {
  if (!user) {
    try {
      user = await new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            resolve(user);
          } else {
            reject("No logged in user");
          }
          unsubscribe();
        }, reject);
      });
    } catch (err) {
      throw new Error("No logged in user", err.toString());
    }
  }
  if (user) {
    const docRef = firestore.collection("users").doc(`${user.uid}`);

    docRef.get().then((doc) => {
      if (!doc.exists) {
        docRef.set({
          uid: user.uid,
          settings: { theme: "dark" },
          bookmarks: {},
        });
      }
    });
  }
};

export const getUserDoc = async (uid) => {
  const docRef = await firestore.collection("users").doc(uid).get();
  return docRef.data();
};
