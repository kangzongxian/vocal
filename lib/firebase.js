// Put Firebase-related stuff into this file
import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { firebaseConfiguration } from './firebase_credentials';

// Add in my Firebase Config
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: firebaseConfiguration.apiKey,
  authDomain: firebaseConfiguration.authDomain,
  projectId: firebaseConfiguration.projectId,
  storageBucket: firebaseConfiguration.storageBucket,
  messagingSenderId: firebaseConfiguration.messagingSenderId,
  appId: firebaseConfiguration.appId,
  measurementId: firebaseConfiguration.measurementId
};

// Initialise the App
// Only initialise of the length is 0 (so that don't initialise more than once)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}


export const auth = firebase.auth();
// Use google authentication
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;


export const fromMillis = firebase.firestore.Timestamp.fromMillis;

export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

export const increment = firebase.firestore.FieldValue.increment;
/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {
  const usersRef = firestore.collection('users');
  const query = usersRef.where('username', '==', username).limit(1);
  const userDoc = (await query.get()).docs[0];
  return userDoc;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}