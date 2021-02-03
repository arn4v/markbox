/* eslint-disable react-hooks/rules-of-hooks */
import firebase from "firebase/app";
import "firebase/firestore";
import { getFirebase } from "./firebase";
import { v4 as uuid } from "uuid";

const { auth, firestore } = getFirebase();

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

export default class StoreHelper {
  /**
   * @param {string} [uid]
   * @param {boolean} getDoc
   */
  constructor(uid, getDoc = true) {
    this.__getDoc__ = getDoc;
    this.__uid__ = uid;
    this.__ref__ = firestore.collection("users").doc(this.__uid__);
    /** @type {Array.<Task>} */
    this.__tasks__ = [];
  }

  /**
   * @param {Schema} schema
   * @param {Bookmark | Tag} data
   */
  add(schema, data) {
    this.__tasks__.push({ type: "add", data, schema });
    return this;
  }

  /**
   * @param {Schema} schema
   * @param {string} id
   */
  delete(schema, id) {
    this.__tasks__.push({ type: "delete", data: { id }, schema });
    return this;
  }

  /** @returns {Promise.<firebase.firestore.DocumentData>} */
  async fetch() {
    if (!this.__uid__) {
      throw new Error("UID not provided");
    } else {
      const data = (await this.__ref__.get()).data();
      console.log(data);
      return data;
    }
  }

  /** @returns {Promise.<firebase.firestore.DocumentData> | Promise.<void>} */
  async run() {
    if (!this.__uid__) {
      throw new Error("UID not provided");
    } else {
      if (this.__tasks__.length > 0) {
        const toMerge = this.__tasks__.reduce((acc, cur) => {
          acc[cur.schema] = {
            ...acc[cur.schema],
            [cur.data.id]:
              cur.type === "add"
                ? cur.data
                : firebase.firestore.FieldValue.delete(),
          };
          return acc;
        }, {});
        try {
          await this.__ref__.set(toMerge, { merge: true });
          if (this.__getDoc__) return await this.fetch();
        } catch (err) {
          throw new Error(err);
        }
      } else {
        try {
          if (this.__getDoc__) return await this.fetch();
        } catch (err) {
          throw new Error(err);
        }
      }
    }
  }
}
