/* eslint-disable react-hooks/rules-of-hooks */
import firebase from "firebase/app";
import "firebase/firestore";
import { getFirebase } from "./firebase";

const { auth, firestore } = getFirebase();

/**
 * @param {Partial<import("firebase").default.auth.UserCredential>} [user]
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
      throw new Error(err);
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
          tags: {},
          folders: {},
        });
      }
    });
  }
};

function timestampToDate(data) {
  console.log(data);
  data = ["bookmarks", "folders", "tags"].reduce((acc, cur) => {
    acc[cur] = Object.values(data[cur]).reduce((acc, cur) => {
      cur.created = cur.created.toDate();
      cur.updated = cur.updated.toDate();
      acc[cur.id] = cur;
      return acc;
    }, {});
    return acc;
  }, {});
  return data;
}

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
   * @param {Bookmark | Folder | Tag} data
   */
  add(schema, data) {
    this.__tasks__.push({
      type: "add",
      schema,
      data: { ...data, created: new Date(), updated: new Date() },
    });
    return this;
  }

  /**
   * @param {Schema} schema
   * @param {Bookmark | Folder | Tag} data
   */
  update(schema, data) {
    this.__tasks__.push({ type: "update", data, schema });
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
      return data;
    }
  }

  /** @returns {Promise.<firebase.firestore.DocumentData>} */
  async run() {
    if (!this.__uid__) {
      throw new Error("UID not provided");
    } else {
      if (this.__tasks__.length > 0) {
        const toMerge = this.__tasks__.reduce((acc, cur) => {
          acc[cur.schema] = {
            ...acc[cur.schema],
            [cur.data.id]:
              cur.type === ("add" || "update")
                ? cur.data
                : firebase.firestore.FieldValue.delete(),
          };
          return acc;
        }, {});
        try {
          await this.__ref__.set(toMerge, { merge: true });
          if (this.__getDoc__) {
            return timestampToDate(await this.fetch());
          }
        } catch (err) {
          throw new Error(err);
        }
      } else {
        try {
          if (this.__getDoc__) {
            return timestampToDate(await this.fetch());
          }
        } catch (err) {
          throw new Error(err);
        }
      }
    }
  }
}
